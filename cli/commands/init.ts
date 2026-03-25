import * as fs from "node:fs";
import * as path from "node:path";
import {
  CONFIG_FILENAME,
  DEFAULT_CSS_FILENAME,
  fetchVersionOrExit,
  findConfigPath,
  PROJECT_NAME,
  saveConfig,
} from "../config.js";
import type { SoluidConfig } from "../config.js";
import { confirm, prompt } from "../prompt.js";
import { allComponentNames } from "../registry.js";

interface InitOptions {
  interactive?: boolean;
}

export async function init(cwd: string, options: InitOptions = {}): Promise<void> {
  const interactive = options.interactive !== false;
  const configPath = findConfigPath(cwd);

  if (fs.existsSync(configPath)) {
    console.error(`${CONFIG_FILENAME} already exists. Delete it first to re-initialize.`);
    process.exit(1);
    return;
  }

  const pkgPath = path.join(cwd, "package.json");
  if (!fs.existsSync(pkgPath) && interactive) {
    const ok = await confirm("package.json not found. Continue anyway? (y/n) ");
    if (!ok) {
      console.log("Aborted.");
      return;
    }
  }

  console.log("Fetching latest components version...");
  const componentsVersion = await fetchVersionOrExit();

  const componentDir = interactive ? await prompt("Component directory?", "src/components/ui") : "src/components/ui";
  const cssPath = interactive
    ? await prompt("CSS path?", `src/${DEFAULT_CSS_FILENAME}`)
    : `src/${DEFAULT_CSS_FILENAME}`;

  const allNames = allComponentNames();

  const config: SoluidConfig = {
    componentsVersion,
    componentDir,
    cssPath,
    components: allNames,
  };

  saveConfig(cwd, config);

  console.log(`\nCreated ${CONFIG_FILENAME} (components v${componentsVersion}, ${allNames.length} components)`);
  console.log("");
  console.log("Next steps:");
  console.log(`  1. Run: npx ${PROJECT_NAME} install`);
  console.log("  2. Import CSS in your entry point:");
  console.log(`     import "./${cssPath.replace(/^src\//, "")}";`);
}
