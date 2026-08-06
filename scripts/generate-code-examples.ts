/**
 * Builds the catalog's Code tab from the demo source.
 *
 * The Code tab used to be a hand-written string next to each demo, so the two
 * drifted apart: over twenty components showed props the demo did not pass, or
 * omitted the ones it did. Deriving the snippet from the demo that is actually
 * on screen makes that impossible.
 */
import * as fs from "fs";
import * as path from "path";
import * as ts from "typescript";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEMOS_FILE = path.resolve(__dirname, "../src/dev/pages/componentDemos.tsx");
const OUT_FILE = path.resolve(__dirname, "../src/dev/code-examples.json");

/** `../../components/ui/soluid/Card` as a consumer would write it. */
function publicModule(specifier: string): string | null {
  const soluid = specifier.match(/components\/ui\/soluid\/(.+)$/);
  if (soluid) return `./soluid/${soluid[1]}`;
  if (specifier === "solid-js") return "solid-js";
  return null;
}

/** Which module each imported identifier came from, for the ones we can show. */
function importedNames(source: ts.SourceFile): Map<string, string> {
  const map = new Map<string, string>();
  for (const statement of source.statements) {
    if (!ts.isImportDeclaration(statement) || !ts.isStringLiteral(statement.moduleSpecifier)) continue;
    const module = publicModule(statement.moduleSpecifier.text);
    if (module === null) continue;
    // Type-only imports are noise in a copy-paste snippet.
    if (statement.importClause?.isTypeOnly) continue;
    const bindings = statement.importClause?.namedBindings;
    if (!bindings || !ts.isNamedImports(bindings)) continue;
    for (const element of bindings.elements) {
      if (element.isTypeOnly) continue;
      map.set(element.name.text, module);
    }
  }
  return map;
}

/**
 * Strip the shared indentation. `getText()` starts mid-line, so the first line
 * carries no indentation and the shift has to come from the lines below it.
 */
function dedent(text: string): string {
  const [first, ...rest] = text.split("\n");
  const indents = rest.filter((line) => line.trim() !== "").map((line) => line.match(/^ */)?.[0].length ?? 0);
  if (indents.length === 0) return first.trim();
  const shift = Math.min(...indents);
  return [first, ...rest.map((line) => line.slice(shift))].join("\n").trimEnd();
}

/** `return (<div />)` -> `<div />` */
function unwrapReturn(expression: ts.Expression, source: ts.SourceFile): string {
  let inner = expression;
  while (ts.isParenthesizedExpression(inner)) inner = inner.expression;
  return dedent(inner.getText(source));
}

/** Identifiers the body actually references, so words inside strings do not count. */
function referencedNames(node: ts.Node): Set<string> {
  const names = new Set<string>();
  const visit = (current: ts.Node) => {
    if (ts.isIdentifier(current)) {
      const parent = current.parent;
      const isMemberName = parent !== undefined && ts.isPropertyAccessExpression(parent) && parent.name === current;
      const isPropertyKey = parent !== undefined && ts.isPropertyAssignment(parent) && parent.name === current;
      if (!isMemberName && !isPropertyKey) names.add(current.text);
    }
    ts.forEachChild(current, visit);
  };
  visit(node);
  return names;
}

function buildSnippet(fn: ts.FunctionDeclaration, source: ts.SourceFile, imports: Map<string, string>): string | null {
  if (!fn.body) return null;

  const setup: { text: string; declaration: boolean }[] = [];
  let markup: string | null = null;

  for (const statement of fn.body.statements) {
    if (ts.isReturnStatement(statement) && statement.expression) {
      markup = unwrapReturn(statement.expression, source);
      continue;
    }
    setup.push({ text: dedent(statement.getText(source)), declaration: ts.isVariableStatement(statement) });
  }
  if (markup === null) return null;

  // Adjacent declarations stay together; anything larger gets breathing room.
  const setupText = setup
    .map((item, i) => {
      if (i === 0) return item.text;
      const gap = item.declaration && setup[i - 1].declaration ? "\n" : "\n\n";
      return gap + item.text;
    })
    .join("");

  const used = referencedNames(fn.body);
  const byModule = new Map<string, string[]>();
  for (const [name, module] of imports) {
    if (!used.has(name)) continue;
    const names = byModule.get(module) ?? [];
    names.push(name);
    byModule.set(module, names);
  }
  const importLines = [...byModule.entries()]
    .sort(([a], [b]) => (a === "solid-js" ? -1 : b === "solid-js" ? 1 : a.localeCompare(b)))
    .map(([module, names]) => `import { ${names.sort().join(", ")} } from "${module}";`);

  return [importLines.join("\n"), setupText, markup].filter(Boolean).join("\n\n") + "\n";
}

const text = fs.readFileSync(DEMOS_FILE, "utf-8");
const source = ts.createSourceFile(DEMOS_FILE, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
const imports = importedNames(source);

const examples: Record<string, string> = {};
for (const statement of source.statements) {
  if (!ts.isFunctionDeclaration(statement) || !statement.name) continue;
  const name = statement.name.text;
  if (!name.endsWith("Demo")) continue;
  const snippet = buildSnippet(statement, source, imports);
  if (snippet !== null) examples[name.slice(0, -"Demo".length)] = snippet;
}

const sorted = Object.fromEntries(
  Object.keys(examples)
    .sort()
    .map((key) => [key, examples[key]]),
);
fs.writeFileSync(OUT_FILE, JSON.stringify(sorted, null, 2) + "\n", "utf-8");
console.log(`Wrote ${Object.keys(sorted).length} code examples to ${path.relative(process.cwd(), OUT_FILE)}`);
