import * as path from "node:path";
import { saveConfig, findConfigPath, CONFIG_FILENAME } from "../config.js";
import type { SouiConfig } from "../config.js";
import { allComponentNames, registry } from "../registry.js";
import * as fs from "node:fs";

export function init(cwd: string): void {
  const configPath = findConfigPath(cwd);

  if (fs.existsSync(configPath)) {
    console.error(`${CONFIG_FILENAME} already exists. Delete it first to re-initialize.`);
    process.exit(1);
  }

  const allNames = allComponentNames();

  const config: SouiConfig = {
    componentDir: "src/components/ui",
    alias: "",
    aliasBase: "src",
    components: allNames,
  };

  saveConfig(cwd, config);

  console.log(`Created ${CONFIG_FILENAME} with ${allNames.length} components.`);
  console.log("");
  console.log("Next steps:");
  console.log(`  1. Edit ${CONFIG_FILENAME} to configure:`);
  console.log("     - componentDir: where to install components");
  console.log('     - alias: import alias (e.g. "@") or "" for relative paths');
  console.log("     - aliasBase: directory the alias maps to (e.g. \"src\")");
  console.log("     - components: remove items you don't need");
  console.log("  2. Run: npx soui add");
  console.log("");
  console.log("Available components:");

  const categories = new Map<string, string[]>();
  for (const name of allNames) {
    const entry = registry[name];
    if (!entry) continue;
    const cat = entry.category === "primitives" ? "Primitives" : capitalize(entry.category);
    if (!categories.has(cat)) categories.set(cat, []);
    const list = categories.get(cat);
    if (list) list.push(`  ${name.padEnd(20)} ${entry.description}`);
  }

  for (const [cat, items] of categories) {
    console.log(`\n  [${cat}]`);
    for (const item of items) {
      console.log(item);
    }
  }
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
