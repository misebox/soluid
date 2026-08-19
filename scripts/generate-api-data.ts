import * as fs from "fs";
import * as path from "path";
import * as ts from "typescript";
import { fileURLToPath } from "url";
import { registry } from "../cli/registry";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface PropInfo {
  name: string;
  type: string;
  optional: boolean;
  /** Accepted values, when the type is a union of string literals. */
  values?: string[];
  /** What the component falls back to when the prop is omitted. */
  default?: string;
}

interface ComponentApi {
  name: string;
  description: string;
  dependencies: string[];
  props: PropInfo[];
}

/**
 * The values a prop accepts, when it is a union of literals.
 *
 * The table shows the alias name (`Size`, not `"sm" | "md" | "lg"`) to keep the
 * Type column narrow, so the members have to travel alongside it. Mixed unions
 * such as `boolean | "true" | "false"` are left alone: listing the literals
 * would misrepresent what the prop takes.
 */
function literalValues(propType: ts.Type): string[] | undefined {
  const parts = propType.isUnion() ? propType.types : [propType];
  const defined = parts.filter((t) => (t.flags & ts.TypeFlags.Undefined) === 0);
  if (defined.length === 0) return undefined;
  if (defined.every((t) => t.isStringLiteral())) {
    return defined.map((t) => JSON.stringify((t as ts.StringLiteralType).value));
  }
  if (defined.every((t) => t.isNumberLiteral())) {
    return defined.map((t) => String((t as ts.NumberLiteralType).value));
  }
  return undefined;
}

/**
 * Defaults, read from the `local.foo ?? "bar"` fallbacks in the component.
 *
 * Only plain literals are reported: an expression like `local.children ?? local.label`
 * has no single value to print. Scoped per file, so a prop name used with two
 * different fallbacks in one file is skipped rather than guessed at.
 */
function defaultsFromSource(sourceFile: ts.SourceFile): Map<string, string> {
  const found = new Map<string, string>();
  const conflicting = new Set<string>();

  const visit = (node: ts.Node) => {
    if (
      ts.isBinaryExpression(node) &&
      node.operatorToken.kind === ts.SyntaxKind.QuestionQuestionToken &&
      ts.isPropertyAccessExpression(node.left) &&
      ts.isIdentifier(node.left.expression) &&
      node.left.expression.text === "local"
    ) {
      const name = node.left.name.text;
      const right = node.right;
      const isLiteral =
        ts.isStringLiteral(right) ||
        ts.isNumericLiteral(right) ||
        right.kind === ts.SyntaxKind.TrueKeyword ||
        right.kind === ts.SyntaxKind.FalseKeyword;
      if (isLiteral) {
        const text = ts.isStringLiteral(right) ? JSON.stringify(right.text) : right.getText(sourceFile);
        const seen = found.get(name);
        if (seen !== undefined && seen !== text) conflicting.add(name);
        else found.set(name, text);
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);

  for (const name of conflicting) found.delete(name);
  return found;
}

function extractPropsFromFile(filePath: string, program: ts.Program): ComponentApi[] {
  const checker = program.getTypeChecker();
  const sourceFile = program.getSourceFile(filePath);
  if (!sourceFile) return [];

  const defaults = defaultsFromSource(sourceFile);
  const results: ComponentApi[] = [];

  ts.forEachChild(sourceFile, (node) => {
    if (!ts.isInterfaceDeclaration(node)) return;
    if (!node.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)) return;

    const name = node.name.text;
    if (!name.endsWith("Props")) return;

    const type = checker.getTypeAtLocation(node);
    const props: PropInfo[] = [];

    for (const prop of type.getProperties()) {
      const decl = prop.declarations?.[0];
      if (!decl) continue;

      // Only what soluid declares. Interfaces that extend JSX.HTMLAttributes
      // inherit hundreds of DOM attributes -- `role` alone is an 839-character
      // union -- and the reference for those is MDN, not this table.
      if (!decl.getSourceFile().fileName.includes("/components/ui/soluid/")) continue;

      const propType = checker.getTypeOfSymbolAtLocation(prop, decl);
      let typeStr = checker.typeToString(propType, decl, ts.TypeFormatFlags.NoTruncation);

      // Clean up type display
      typeStr = typeStr.replace(/Element \| undefined/, "JSX.Element");
      if (typeStr === "Element") typeStr = "JSX.Element";

      const optional = (prop.flags & ts.SymbolFlags.Optional) !== 0;
      // Strip " | undefined" suffix for optional props (redundant)
      if (optional) {
        typeStr = typeStr.replace(/ \| undefined$/, "");
      }
      props.push({
        name: prop.name,
        type: typeStr,
        optional,
        values: literalValues(propType),
        default: optional ? defaults.get(prop.name) : undefined,
      });
    }

    results.push({
      name,
      description: "",
      dependencies: [],
      props,
    });
  });

  return results;
}

function main() {
  const componentsDir = path.resolve(__dirname, "../src/components/ui/soluid");
  const typesFile = path.join(componentsDir, "core/types.ts");

  // Collect all .tsx files in the components directory (not in core/)
  const tsxFiles: string[] = [];
  for (const entry of fs.readdirSync(componentsDir)) {
    if (entry.endsWith(".tsx")) {
      tsxFiles.push(path.join(componentsDir, entry));
    }
  }
  tsxFiles.push(typesFile);

  const program = ts.createProgram(tsxFiles, {
    target: ts.ScriptTarget.ESNext,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    jsx: ts.JsxEmit.Preserve,
    jsxImportSource: "solid-js",
    strict: true,
    skipLibCheck: true,
  });

  const allApis: ComponentApi[] = [];

  for (const file of tsxFiles) {
    if (file === typesFile) continue;
    const apis = extractPropsFromFile(file, program);
    allApis.push(...apis);
  }

  // Merge registry metadata
  for (const api of allApis) {
    const componentName = api.name.replace(/Props$/, "");
    const entry = registry[componentName];
    if (entry) {
      api.description = entry.description;
      api.dependencies = entry.dependencies;
    }
  }

  // Sort alphabetically
  allApis.sort((a, b) => a.name.localeCompare(b.name));

  const outPath = path.resolve(__dirname, "../src/dev/api-data.json");
  fs.writeFileSync(outPath, JSON.stringify(allApis, null, 2) + "\n");
  console.log(`Generated ${allApis.length} component APIs -> ${outPath}`);
}

main();
