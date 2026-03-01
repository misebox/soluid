import * as fs from "node:fs";
import * as path from "node:path";
import * as readline from "node:readline";
import { CONFIG_FILENAME, findConfigPath, saveConfig } from "../config.js";
import type { SolidoutConfig } from "../config.js";
import { allComponentNames } from "../registry.js";

function confirm(question: string): Promise<boolean> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase() === "y");
    });
  });
}

export async function init(cwd: string): Promise<void> {
  const configPath = findConfigPath(cwd);

  if (fs.existsSync(configPath)) {
    console.error(`${CONFIG_FILENAME} already exists. Delete it first to re-initialize.`);
    process.exit(1);
    return;
  }

  const pkgPath = path.join(cwd, "package.json");
  if (!fs.existsSync(pkgPath)) {
    const ok = await confirm("package.json not found. Continue anyway? (y/n) ");
    if (!ok) {
      console.log("Aborted.");
      return;
    }
  }

  const allNames = allComponentNames();

  const config: SolidoutConfig = {
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
  console.log("     - alias: import alias (e.g. \"@\") or \"\" for relative paths");
  console.log("     - aliasBase: directory the alias maps to (e.g. \"src\")");
  console.log("     - components: remove items you don't need");
  console.log("  2. Run: npx solidout add");
  console.log("");
  console.log(`Run "solidout list" to see available components.`);
}
