import * as ts from "typescript";
import * as path from "path";
import * as fs from "fs";
import { fileURLToPath } from "url";
import { registry } from "../cli/registry";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface PropInfo {
  name: string;
  type: string;
  optional: boolean;
}

interface ComponentApi {
  name: string;
  description: string;
  dependencies: string[];
  props: PropInfo[];
}

function extractPropsFromFile(filePath: string, program: ts.Program): ComponentApi[] {
  const checker = program.getTypeChecker();
  const sourceFile = program.getSourceFile(filePath);
  if (!sourceFile) return [];

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
      props.push({ name: prop.name, type: typeStr, optional });
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
