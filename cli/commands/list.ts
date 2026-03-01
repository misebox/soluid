import * as fs from "node:fs";
import * as path from "node:path";
import { loadConfig } from "../config.js";
import { allComponentNames, registry } from "../registry.js";

type Filter = "all" | "installed" | "not-installed";

export function list(cwd: string, filter: Filter): void {
  const config = loadConfig(cwd);
  const allNames = allComponentNames();

  // Determine which components are installed (files exist on disk)
  const installed = new Set<string>();
  if (config) {
    const targetRoot = path.resolve(cwd, config.componentDir);
    for (const name of allNames) {
      const entry = registry[name];
      if (!entry) continue;
      const allExist = entry.files.every((file) => fs.existsSync(path.join(targetRoot, file)));
      if (allExist) installed.add(name);
    }
  }

  // Group by category
  const categories = new Map<string, string[]>();
  for (const name of allNames) {
    const entry = registry[name];
    if (!entry) continue;

    if (filter === "installed" && !installed.has(name)) continue;
    if (filter === "not-installed" && installed.has(name)) continue;

    const cat = entry.category === "primitives" ? "Primitives" : capitalize(entry.category);
    if (!categories.has(cat)) categories.set(cat, []);
    const list = categories.get(cat);
    const status = installed.has(name) ? " [installed]" : "";
    if (list) list.push(`  ${name.padEnd(20)} ${entry.description}${status}`);
  }

  let count = 0;
  for (const [cat, items] of categories) {
    console.log(`\n  [${cat}]`);
    for (const item of items) {
      console.log(item);
    }
    count += items.length;
  }

  if (count === 0) {
    console.log("  (none)");
  }

  console.log(`\n${count} component(s)`);
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
