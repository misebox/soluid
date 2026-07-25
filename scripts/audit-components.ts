/**
 * Static audit of the soluid component set.
 *
 * Parses every component `.tsx` / `.css`, the CLI registry, the public
 * `src/index.ts` barrel and the catalog metadata, then applies a fixed rule
 * set covering registry consistency, public API completeness, Solid
 * reactivity pitfalls, accessibility and CSS token hygiene.
 *
 * Run: bun scripts/audit-components.ts [--strict] [--rule <id>] [--json]
 *   --strict  treat warnings as errors
 *   --rule    only run rules whose id contains the given substring
 *   --json    emit findings as JSON instead of a text report
 *
 * Exits 1 when any error-level finding is reported.
 */

import * as fs from "fs";
import * as path from "path";
import * as ts from "typescript";
import { fileURLToPath } from "url";
import { registry } from "../cli/registry";
import { CATEGORIES, CODE_EXAMPLES, DEMOS, SUB_COMPONENTS } from "../src/dev/pages/componentDemos";
import { en } from "../src/dev/locales/en";
import { ja } from "../src/dev/locales/ja";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const COMPONENT_DIR = path.join(ROOT, "src/components/ui/soluid");
const CORE_DIR = path.join(COMPONENT_DIR, "core");
const INDEX_FILE = path.join(ROOT, "src/index.ts");
const TOKEN_FILE = path.join(CORE_DIR, "soluid.css");

// ---------------------------------------------------------------- model

type Level = "error" | "warn";

interface Finding {
  rule: string;
  level: Level;
  file: string;
  line?: number;
  message: string;
}

interface ComponentSource {
  /** Component name derived from the file name, e.g. "TextField" */
  name: string;
  file: string;
  text: string;
  ast: ts.SourceFile;
  /** Exported function declarations whose name starts with an uppercase letter */
  exportedComponents: { name: string; node: ts.FunctionDeclaration }[];
  /** Exported interfaces whose name ends with "Props" */
  exportedPropsTypes: string[];
}

interface AuditContext {
  components: ComponentSource[];
  /** Value + type names re-exported from src/index.ts */
  indexExports: Set<string>;
  /** `--so-*` custom properties defined in core/soluid.css */
  definedTokens: Set<string>;
  /** `.css` files under the component directory, keyed by basename */
  cssFiles: { file: string; text: string }[];
}

interface Rule {
  id: string;
  level: Level;
  summary: string;
  check: (ctx: AuditContext) => Finding[];
}

// ---------------------------------------------------------------- loading

function relative(file: string): string {
  return path.relative(ROOT, file);
}

function lineOf(source: ts.SourceFile, pos: number): number {
  return source.getLineAndCharacterOfPosition(pos).line + 1;
}

function isComponentName(name: string): boolean {
  return /^[A-Z]/.test(name);
}

function parseComponent(file: string): ComponentSource {
  const text = fs.readFileSync(file, "utf8");
  const ast = ts.createSourceFile(file, text, ts.ScriptTarget.ESNext, true, ts.ScriptKind.TSX);

  const exportedComponents: { name: string; node: ts.FunctionDeclaration }[] = [];
  const exportedPropsTypes: string[] = [];

  for (const node of ast.statements) {
    const exported =
      ts.canHaveModifiers(node) && ts.getModifiers(node)?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword);
    if (!exported) continue;

    if (ts.isFunctionDeclaration(node) && node.name && isComponentName(node.name.text)) {
      exportedComponents.push({ name: node.name.text, node });
    }
    if ((ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node)) && node.name.text.endsWith("Props")) {
      exportedPropsTypes.push(node.name.text);
    }
  }

  return {
    name: path.basename(file, ".tsx"),
    file,
    text,
    ast,
    exportedComponents,
    exportedPropsTypes,
  };
}

function loadIndexExports(): Set<string> {
  const text = fs.readFileSync(INDEX_FILE, "utf8");
  const ast = ts.createSourceFile(INDEX_FILE, text, ts.ScriptTarget.ESNext, true);
  const names = new Set<string>();

  for (const node of ast.statements) {
    if (!ts.isExportDeclaration(node) || !node.exportClause) continue;
    if (!ts.isNamedExports(node.exportClause)) continue;
    for (const element of node.exportClause.elements) {
      names.add(element.name.text);
    }
  }
  return names;
}

function loadContext(): AuditContext {
  const entries = fs.readdirSync(COMPONENT_DIR);

  const components = entries
    .filter((e) => e.endsWith(".tsx"))
    .map((e) => parseComponent(path.join(COMPONENT_DIR, e)))
    .sort((a, b) => a.name.localeCompare(b.name));

  const cssFiles = [
    ...entries.filter((e) => e.endsWith(".css")).map((e) => path.join(COMPONENT_DIR, e)),
    TOKEN_FILE,
  ].map((file) => ({ file, text: fs.readFileSync(file, "utf8") }));

  const definedTokens = new Set<string>();
  for (const match of fs.readFileSync(TOKEN_FILE, "utf8").matchAll(/^\s*(--so-[a-z0-9-]+)\s*:/gm)) {
    definedTokens.add(match[1]);
  }

  return { components, indexExports: loadIndexExports(), definedTokens, cssFiles };
}

// ---------------------------------------------------------------- AST helpers

function walk(node: ts.Node, visit: (node: ts.Node) => void): void {
  visit(node);
  ts.forEachChild(node, (child) => walk(child, visit));
}

/** All JSX opening/self-closing elements with the given lowercase tag name. */
function findJsxTags(source: ComponentSource, tag: string): (ts.JsxOpeningElement | ts.JsxSelfClosingElement)[] {
  const found: (ts.JsxOpeningElement | ts.JsxSelfClosingElement)[] = [];
  walk(source.ast, (node) => {
    if (!ts.isJsxOpeningElement(node) && !ts.isJsxSelfClosingElement(node)) return;
    if (node.tagName.getText() === tag) found.push(node);
  });
  return found;
}

function attributeNames(node: ts.JsxOpeningElement | ts.JsxSelfClosingElement): Set<string> {
  const names = new Set<string>();
  for (const attr of node.attributes.properties) {
    if (ts.isJsxAttribute(attr)) names.add(attr.name.getText());
  }
  return names;
}

function hasSpread(node: ts.JsxOpeningElement | ts.JsxSelfClosingElement): boolean {
  return node.attributes.properties.some(ts.isJsxSpreadAttribute);
}

/** Function bodies of exported components, plus non-exported local components. */
function componentBodies(source: ComponentSource): { name: string; node: ts.FunctionDeclaration }[] {
  const bodies: { name: string; node: ts.FunctionDeclaration }[] = [];
  for (const node of source.ast.statements) {
    if (ts.isFunctionDeclaration(node) && node.name && isComponentName(node.name.text)) {
      bodies.push({ name: node.name.text, node });
    }
  }
  return bodies;
}

// ---------------------------------------------------------------- rules

const registryRules: Rule[] = [
  {
    id: "registry/file-exists",
    level: "error",
    summary: "Every file listed in the registry exists on disk",
    check: () => {
      const findings: Finding[] = [];
      for (const entry of Object.values(registry)) {
        for (const rel of entry.files) {
          // Registry paths are archive-relative: "soluid/Button.tsx"
          const abs = path.join(COMPONENT_DIR, "..", rel);
          if (!fs.existsSync(abs)) {
            findings.push({
              rule: "registry/file-exists",
              level: "error",
              file: "cli/registry.ts",
              message: `${entry.name}: listed file "${rel}" does not exist`,
            });
          }
        }
      }
      return findings;
    },
  },
  {
    id: "registry/no-orphan-file",
    level: "error",
    summary: "Every component source file is claimed by a registry entry",
    check: () => {
      const claimed = new Set(Object.values(registry).flatMap((e) => e.files.map((f) => f.replace(/^soluid\//, ""))));
      const findings: Finding[] = [];

      const walkDir = (dir: string, prefix: string) => {
        for (const name of fs.readdirSync(dir)) {
          const abs = path.join(dir, name);
          if (fs.statSync(abs).isDirectory()) {
            walkDir(abs, `${prefix}${name}/`);
            continue;
          }
          if (!/\.(tsx|ts|css)$/.test(name)) continue;
          if (!claimed.has(`${prefix}${name}`)) {
            findings.push({
              rule: "registry/no-orphan-file",
              level: "error",
              file: relative(abs),
              message: "file is not listed in any registry entry — it will not be installed",
            });
          }
        }
      };
      walkDir(COMPONENT_DIR, "");
      return findings;
    },
  },
  {
    id: "registry/known-dependency",
    level: "error",
    summary: "Registry dependencies reference existing entries",
    check: () => {
      const findings: Finding[] = [];
      for (const entry of Object.values(registry)) {
        for (const dep of entry.dependencies) {
          if (!registry[dep]) {
            findings.push({
              rule: "registry/known-dependency",
              level: "error",
              file: "cli/registry.ts",
              message: `${entry.name}: unknown dependency "${dep}"`,
            });
          }
        }
      }
      return findings;
    },
  },
  {
    id: "registry/declared-import",
    level: "error",
    summary: "Sibling components imported by a component are declared as dependencies",
    check: ({ components }) => {
      const findings: Finding[] = [];
      // Map every registry file back to the entry that owns it.
      const owner = new Map<string, string>();
      for (const entry of Object.values(registry)) {
        for (const file of entry.files) owner.set(file.replace(/^soluid\//, ""), entry.name);
      }

      for (const source of components) {
        const entryName = owner.get(`${source.name}.tsx`);
        if (!entryName) continue;
        const entry = registry[entryName];
        const declared = new Set([entryName, ...entry.dependencies]);

        for (const statement of source.ast.statements) {
          if (!ts.isImportDeclaration(statement)) continue;
          const spec = (statement.moduleSpecifier as ts.StringLiteral).text;
          if (!spec.startsWith("./")) continue;
          const target = `${spec.replace(/^\.\//, "")}.tsx`;
          const targetOwner = owner.get(target) ?? owner.get(`${spec.replace(/^\.\//, "")}.ts`);
          if (!targetOwner || declared.has(targetOwner)) continue;
          findings.push({
            rule: "registry/declared-import",
            level: "error",
            file: relative(source.file),
            line: lineOf(source.ast, statement.getStart()),
            message: `imports ${spec} (owned by "${targetOwner}") but "${entryName}" does not depend on it`,
          });
        }
      }
      return findings;
    },
  },
];

const apiRules: Rule[] = [
  {
    id: "api/exported-from-index",
    level: "error",
    summary: "Every exported component is re-exported from src/index.ts",
    check: ({ components, indexExports }) => {
      const findings: Finding[] = [];
      for (const source of components) {
        for (const { name, node } of source.exportedComponents) {
          if (indexExports.has(name)) continue;
          findings.push({
            rule: "api/exported-from-index",
            level: "error",
            file: relative(source.file),
            line: lineOf(source.ast, node.getStart()),
            message: `${name} is exported from the component file but missing from src/index.ts`,
          });
        }
      }
      return findings;
    },
  },
  {
    id: "api/props-type-exported",
    level: "warn",
    summary: "Every exported Props interface is re-exported from src/index.ts",
    check: ({ components, indexExports }) => {
      const findings: Finding[] = [];
      for (const source of components) {
        for (const name of source.exportedPropsTypes) {
          if (indexExports.has(name)) continue;
          findings.push({
            rule: "api/props-type-exported",
            level: "warn",
            file: relative(source.file),
            message: `${name} is not re-exported from src/index.ts`,
          });
        }
      }
      return findings;
    },
  },
  {
    id: "api/props-interface-named",
    level: "warn",
    summary: "Components declare their props as an exported `<Name>Props` interface",
    check: ({ components }) => {
      const findings: Finding[] = [];
      for (const source of components) {
        for (const { name, node } of source.exportedComponents) {
          if (source.exportedPropsTypes.includes(`${name}Props`)) continue;
          findings.push({
            rule: "api/props-interface-named",
            level: "warn",
            file: relative(source.file),
            line: lineOf(source.ast, node.getStart()),
            message: `${name} has no exported "${name}Props" interface — props are undocumented in the catalog`,
          });
        }
      }
      return findings;
    },
  },
];

const solidRules: Rule[] = [
  {
    id: "solid/no-module-counter-id",
    level: "error",
    summary: "Element ids come from createUniqueId(), not a module-level counter",
    check: ({ components }) => {
      const findings: Finding[] = [];
      for (const source of components) {
        for (const statement of source.ast.statements) {
          if (!ts.isVariableStatement(statement)) continue;
          for (const decl of statement.declarationList.declarations) {
            const name = decl.name.getText();
            if (!/counter$/i.test(name)) continue;
            findings.push({
              rule: "solid/no-module-counter-id",
              level: "error",
              file: relative(source.file),
              line: lineOf(source.ast, statement.getStart()),
              message: `module-level "${name}" produces ids that differ between server and client renders — use createUniqueId()`,
            });
          }
        }
      }
      return findings;
    },
  },
  {
    id: "solid/no-props-destructure",
    level: "error",
    summary: "Component parameters are not destructured (destructuring breaks reactivity)",
    check: ({ components }) => {
      const findings: Finding[] = [];
      for (const source of components) {
        for (const { name, node } of componentBodies(source)) {
          const param = node.parameters[0];
          if (!param || !ts.isObjectBindingPattern(param.name)) continue;
          findings.push({
            rule: "solid/no-props-destructure",
            level: "error",
            file: relative(source.file),
            line: lineOf(source.ast, param.getStart()),
            message: `${name} destructures its props parameter — the getter chain is lost and updates stop propagating`,
          });
        }
      }
      return findings;
    },
  },
  {
    id: "solid/forward-rest-props",
    level: "error",
    summary: "splitProps rest is captured and spread onto the root element",
    check: ({ components }) => {
      const findings: Finding[] = [];
      for (const source of components) {
        walk(source.ast, (node) => {
          if (!ts.isVariableDeclaration(node)) return;
          const init = node.initializer;
          if (!init || !ts.isCallExpression(init)) return;
          if (init.expression.getText() !== "splitProps") return;
          if (!ts.isArrayBindingPattern(node.name)) return;

          const rest = node.name.elements[1];
          const restName = rest && ts.isBindingElement(rest) ? rest.name.getText() : undefined;

          if (!restName) {
            findings.push({
              rule: "solid/forward-rest-props",
              level: "error",
              file: relative(source.file),
              line: lineOf(source.ast, node.getStart()),
              message: "splitProps rest is discarded — callers cannot pass id, name, aria-* or event handlers through",
            });
            return;
          }
          if (restName.startsWith("_")) {
            findings.push({
              rule: "solid/forward-rest-props",
              level: "error",
              file: relative(source.file),
              line: lineOf(source.ast, node.getStart()),
              message: `splitProps rest "${restName}" is deliberately unused — extra props are silently dropped`,
            });
            return;
          }
          if (!new RegExp(`\\{\\s*\\.\\.\\.${restName}\\s*\\}`).test(source.text)) {
            findings.push({
              rule: "solid/forward-rest-props",
              level: "error",
              file: relative(source.file),
              line: lineOf(source.ast, node.getStart()),
              message: `splitProps rest "${restName}" is never spread onto an element`,
            });
          }
        });
      }
      return findings;
    },
  },
  {
    id: "solid/no-early-return",
    level: "error",
    summary: "Components do not branch with a bare `return` on a reactive prop",
    check: ({ components }) => {
      const findings: Finding[] = [];
      for (const source of components) {
        for (const { name, node } of componentBodies(source)) {
          for (const statement of node.body?.statements ?? []) {
            if (!ts.isIfStatement(statement)) continue;
            const branch = statement.thenStatement;
            const returns =
              ts.isReturnStatement(branch) || (ts.isBlock(branch) && branch.statements.some(ts.isReturnStatement));
            if (!returns) continue;
            findings.push({
              rule: "solid/no-early-return",
              level: "error",
              file: relative(source.file),
              line: lineOf(source.ast, statement.getStart()),
              message: `${name} returns early on a condition evaluated once at setup — later prop changes never re-render; use <Show>`,
            });
          }
        }
      }
      return findings;
    },
  },
  {
    id: "solid/effect-listener-cleanup",
    level: "error",
    summary: "Listeners registered inside createEffect are removed by onCleanup in the same effect",
    check: ({ components }) => {
      const findings: Finding[] = [];
      for (const source of components) {
        walk(source.ast, (node) => {
          if (!ts.isCallExpression(node)) return;
          if (node.expression.getText() !== "createEffect") return;
          const body = node.getText();
          if (!body.includes("addEventListener")) return;
          if (body.includes("onCleanup")) return;
          findings.push({
            rule: "solid/effect-listener-cleanup",
            level: "error",
            file: relative(source.file),
            line: lineOf(source.ast, node.getStart()),
            message:
              "createEffect registers a listener without an onCleanup inside the effect — re-runs leak the previous listener",
          });
        });
      }
      return findings;
    },
  },
];

/** Roles that duplicate the implicit semantics of their host element. */
const IMPLICIT_ROLES: Record<string, string> = {
  table: "table",
  hr: "separator",
  nav: "navigation",
  ul: "list",
  ol: "list",
  li: "listitem",
  button: "button",
  main: "main",
  header: "banner",
  footer: "contentinfo",
  form: "form",
  dialog: "dialog",
};

const a11yRules: Rule[] = [
  {
    id: "a11y/button-type",
    level: "error",
    summary: "Every <button> sets an explicit type",
    check: ({ components }) => {
      const findings: Finding[] = [];
      for (const source of components) {
        for (const node of findJsxTags(source, "button")) {
          const attrs = attributeNames(node);
          if (attrs.has("type")) continue;
          // A spread may supply type at runtime, but the default stays "submit"
          // until the caller does so — still worth flagging.
          findings.push({
            rule: "a11y/button-type",
            level: "error",
            file: relative(source.file),
            line: lineOf(source.ast, node.getStart()),
            message: hasSpread(node)
              ? "<button> has no default type — inside a <form> it submits unless the caller passes type"
              : "<button> has no type — it defaults to submit inside a <form>",
          });
        }
      }
      return findings;
    },
  },
  {
    id: "a11y/no-redundant-role",
    level: "warn",
    summary: "role does not restate the element's implicit semantics",
    check: ({ components }) => {
      const findings: Finding[] = [];
      for (const source of components) {
        for (const [tag, implicit] of Object.entries(IMPLICIT_ROLES)) {
          for (const node of findJsxTags(source, tag)) {
            const role = node.attributes.properties.find(
              (p): p is ts.JsxAttribute => ts.isJsxAttribute(p) && p.name.getText() === "role",
            );
            const value = role?.initializer;
            if (!value || !ts.isStringLiteral(value) || value.text !== implicit) continue;
            findings.push({
              rule: "a11y/no-redundant-role",
              level: "warn",
              file: relative(source.file),
              line: lineOf(source.ast, node.getStart()),
              message: `<${tag} role="${implicit}"> restates the implicit role — drop the attribute`,
            });
          }
        }
      }
      return findings;
    },
  },
  {
    id: "a11y/overridable-label",
    level: "warn",
    summary: "Hardcoded English aria-labels are overridable through props",
    check: ({ components }) => {
      const findings: Finding[] = [];
      for (const source of components) {
        walk(source.ast, (node) => {
          if (!ts.isJsxAttribute(node)) return;
          if (node.name.getText() !== "aria-label") return;
          const value = node.initializer;
          if (!value || !ts.isStringLiteral(value)) return;
          findings.push({
            rule: "a11y/overridable-label",
            level: "warn",
            file: relative(source.file),
            line: lineOf(source.ast, node.getStart()),
            message: `aria-label="${value.text}" is hardcoded English — expose a prop so it can be localized`,
          });
        });
      }
      return findings;
    },
  },
  {
    id: "a11y/interactive-div",
    level: "warn",
    summary: "Click handlers live on real interactive elements, not bare divs",
    check: ({ components }) => {
      const findings: Finding[] = [];
      for (const source of components) {
        for (const tag of ["div", "span"]) {
          for (const node of findJsxTags(source, tag)) {
            const attrs = attributeNames(node);
            if (!attrs.has("onClick")) continue;
            if (attrs.has("role") && attrs.has("tabIndex")) continue;
            findings.push({
              rule: "a11y/interactive-div",
              level: "warn",
              file: relative(source.file),
              line: lineOf(source.ast, node.getStart()),
              message: `<${tag} onClick> without both role and tabIndex is unreachable by keyboard`,
            });
          }
        }
      }
      return findings;
    },
  },
];

/** `--so-color-<name>-<role>` tokens generated for every colour by createTheme(). */
const COLOR_ROLE_TOKEN = /^--so-color-[a-z]+-(base|fg|subtle|subtle-fg|border|hover|active)$/;

/** Blank out `/* ... *\/` comments, preserving newlines so line numbers stay valid. */
function stripComments(css: string): string {
  return css.replace(/\/\*[\s\S]*?\*\//g, (comment) => comment.replace(/[^\n]/g, " "));
}

const cssRules: Rule[] = [
  {
    id: "css/no-import-in-tsx",
    level: "error",
    summary: "Component .tsx files never import CSS (CSS is concatenated at install time)",
    check: ({ components }) => {
      const findings: Finding[] = [];
      for (const source of components) {
        for (const statement of source.ast.statements) {
          if (!ts.isImportDeclaration(statement)) continue;
          const spec = (statement.moduleSpecifier as ts.StringLiteral).text;
          if (!spec.endsWith(".css")) continue;
          findings.push({
            rule: "css/no-import-in-tsx",
            level: "error",
            file: relative(source.file),
            line: lineOf(source.ast, statement.getStart()),
            message: `imports "${spec}" — CSS must be delivered through the concatenated bundle`,
          });
        }
      }
      return findings;
    },
  },
  {
    id: "css/defined-token",
    level: "error",
    summary: "Every var(--so-*) reference resolves to a token defined in core/soluid.css",
    check: ({ definedTokens, cssFiles }) => {
      const findings: Finding[] = [];
      for (const { file, text } of cssFiles) {
        const localDefs = new Set(Array.from(text.matchAll(/^\s*(--so-[a-z0-9-]+)\s*:/gm), (m) => m[1]));
        const lines = text.split("\n");
        lines.forEach((line, i) => {
          for (const match of line.matchAll(/var\((--so-[a-z0-9-]+)/g)) {
            const token = match[1];
            if (definedTokens.has(token) || localDefs.has(token)) continue;
            findings.push({
              rule: "css/defined-token",
              level: "error",
              file: relative(file),
              line: i + 1,
              message: `var(${token}) is not defined in core/soluid.css`,
            });
          }
        });
      }
      return findings;
    },
  },
  {
    id: "css/token-used",
    level: "warn",
    summary: "Every token defined in core/soluid.css is used somewhere",
    check: ({ definedTokens, cssFiles }) => {
      const used = new Set<string>();
      for (const { text } of cssFiles) {
        for (const match of text.matchAll(/var\((--so-[a-z0-9-]+)/g)) used.add(match[1]);
      }
      return (
        Array.from(definedTokens)
          .filter((token) => !used.has(token))
          // createTheme() emits the full role set for every colour, so a role no
          // built-in component happens to paint is still part of the contract.
          .filter((token) => !COLOR_ROLE_TOKEN.test(token))
          .map((token) => ({
            rule: "css/token-used",
            level: "warn" as const,
            file: relative(TOKEN_FILE),
            message: `${token} is defined but never referenced`,
          }))
      );
    },
  },
  {
    id: "css/so-prefix",
    level: "error",
    summary: "Class selectors are namespaced with the `so-` prefix",
    check: ({ cssFiles }) => {
      const findings: Finding[] = [];
      for (const { file, text } of cssFiles) {
        const source = stripComments(text);
        // Selector = everything between the previous block boundary and "{".
        for (const block of source.matchAll(/(^|[};])([^{};]*)\{/g)) {
          const selector = block[2];
          for (const match of selector.matchAll(/\.([a-zA-Z][\w-]*)/g)) {
            if (match[1].startsWith("so-")) continue;
            findings.push({
              rule: "css/so-prefix",
              level: "error",
              file: relative(file),
              line: source.slice(0, block.index).split("\n").length,
              message: `class ".${match[1]}" is not namespaced — it can collide with host application styles`,
            });
          }
        }
      }
      return findings;
    },
  },
  {
    id: "css/paired-file",
    level: "warn",
    summary: "A component's CSS file is registered alongside its .tsx",
    check: ({ components }) => {
      const findings: Finding[] = [];
      for (const source of components) {
        const cssPath = path.join(COMPONENT_DIR, `${source.name}.css`);
        if (!fs.existsSync(cssPath)) continue;
        const registered = Object.values(registry).some((e) => e.files.includes(`soluid/${source.name}.css`));
        if (registered) continue;
        findings.push({
          rule: "css/paired-file",
          level: "warn",
          file: relative(cssPath),
          message: `${source.name}.css exists but no registry entry installs it`,
        });
      }
      return findings;
    },
  },
];

const catalogRules: Rule[] = [
  {
    id: "catalog/component-documented",
    level: "error",
    summary: "Catalog components have a demo, a code example and a description",
    check: () => {
      const findings: Finding[] = [];
      for (const name of CATEGORIES.flatMap((c) => c.components)) {
        const missing: string[] = [];
        if (!DEMOS[name]) missing.push("DEMOS");
        if (!CODE_EXAMPLES[name]) missing.push("CODE_EXAMPLES");
        if (!en[`desc.${name}`]) missing.push("en desc");
        if (!ja[`desc.${name}`]) missing.push("ja desc");
        if (missing.length === 0) continue;
        findings.push({
          rule: "catalog/component-documented",
          level: "error",
          file: "src/dev/pages/componentDemos.tsx",
          message: `${name}: missing from ${missing.join(", ")}`,
        });
      }
      return findings;
    },
  },
  {
    id: "catalog/registry-listed",
    level: "error",
    summary: "Every installable component appears in the catalog",
    check: () => {
      // A component is discoverable either as its own catalog entry or as a
      // documented sub-component of one (HStack under Stack, and so on).
      const listed = new Set([...CATEGORIES.flatMap((c) => c.components), ...Object.values(SUB_COMPONENTS).flat()]);
      return Object.values(registry)
        .filter((e) => e.category === "components" && !listed.has(e.name))
        .map((e) => ({
          rule: "catalog/registry-listed",
          level: "error" as const,
          file: "src/dev/pages/componentDemos.tsx",
          message: `${e.name} is installable but absent from the catalog — users cannot discover it`,
        }));
    },
  },
  {
    id: "catalog/prop-described",
    level: "warn",
    summary: "Every public prop has an en and ja description",
    check: ({ components }) => {
      const findings: Finding[] = [];
      for (const source of components) {
        for (const node of source.ast.statements) {
          if (!ts.isInterfaceDeclaration(node)) continue;
          if (!source.exportedPropsTypes.includes(node.name.text)) continue;
          for (const member of node.members) {
            if (!ts.isPropertySignature(member) || !member.name) continue;
            const prop = member.name.getText().replace(/^["']|["']$/g, "");
            const key = `${node.name.text}.${prop}`;
            const missing = [!en[key] && "en", !ja[key] && "ja"].filter(Boolean);
            if (missing.length === 0) continue;
            findings.push({
              rule: "catalog/prop-described",
              level: "warn",
              file: relative(source.file),
              line: lineOf(source.ast, member.getStart()),
              message: `${key} has no ${missing.join("/")} description`,
            });
          }
        }
      }
      return findings;
    },
  },
];

const RULES: Rule[] = [...registryRules, ...apiRules, ...solidRules, ...a11yRules, ...cssRules, ...catalogRules];

// ---------------------------------------------------------------- reporting

function report(findings: Finding[], ruleById: Map<string, Rule>): void {
  const byRule = new Map<string, Finding[]>();
  for (const finding of findings) {
    const list = byRule.get(finding.rule) ?? [];
    list.push(finding);
    byRule.set(finding.rule, list);
  }

  for (const [id, list] of byRule) {
    const rule = ruleById.get(id);
    const marker = list[0].level === "error" ? "ERROR" : "WARN ";
    console.log(`\n${marker} ${id} — ${rule?.summary ?? ""} (${list.length})`);
    for (const finding of list) {
      const where = finding.line ? `${finding.file}:${finding.line}` : finding.file;
      console.log(`  ${where}\n    ${finding.message}`);
    }
  }
}

function main(): void {
  const args = process.argv.slice(2);
  const strict = args.includes("--strict");
  const asJson = args.includes("--json");
  const filter = args[args.indexOf("--rule") + 1];
  const rules = args.includes("--rule") ? RULES.filter((r) => r.id.includes(filter)) : RULES;

  const ctx = loadContext();
  const findings = rules.flatMap((rule) => rule.check(ctx));

  if (asJson) {
    console.log(JSON.stringify(findings, null, 2));
  } else {
    report(findings, new Map(rules.map((r) => [r.id, r])));
  }

  const errors = findings.filter((f) => f.level === "error").length;
  const warnings = findings.length - errors;

  if (!asJson) {
    console.log(
      `\n${ctx.components.length} components, ${rules.length} rules — ${errors} error(s), ${warnings} warning(s)`,
    );
  }

  if (errors > 0 || (strict && warnings > 0)) process.exit(1);
}

main();
