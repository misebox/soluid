import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { loadConfig, CONFIG_FILENAME } from "../config.js";
import {
  registry,
  resolveDependencies,
  collectNpmDeps,
} from "../registry.js";
import { rewriteImports } from "../rewrite-imports.js";

export function add(cwd: string): void {
  const config = loadConfig(cwd);
  if (config === null) {
    console.error(`${CONFIG_FILENAME} not found. Run: npx soui init`);
    process.exit(1);
    return; // unreachable but helps TS narrow
  }

  if (config.components.length === 0) {
    console.error("No components specified in config.");
    process.exit(1);
    return;
  }

  // Validate component names
  const invalid = config.components.filter((name) => !registry[name]);
  if (invalid.length > 0) {
    console.error(`Unknown components: ${invalid.join(", ")}`);
    process.exit(1);
    return;
  }

  // Resolve dependencies (always includes core)
  const resolved = resolveDependencies(["core", ...config.components]);
  const npmDeps = collectNpmDeps(resolved);

  console.log(`Installing ${resolved.length} items (including dependencies):`);

  // Find template root: src/ is shipped alongside dist-cli/
  // dist-cli/commands/add.js → ../../src/
  const cliDir = path.dirname(fileURLToPath(import.meta.url));
  const packageRoot = path.resolve(cliDir, "..", "..");
  const templateRoot = path.resolve(packageRoot, "src");
  const targetRoot = path.resolve(cwd, config.componentDir);

  let copiedCount = 0;

  for (const name of resolved) {
    const entry = registry[name];
    if (!entry) continue;

    for (const file of entry.files) {
      const srcPath = path.join(templateRoot, file);
      const destPath = path.join(targetRoot, file);

      if (!fs.existsSync(srcPath)) {
        console.warn(`  SKIP (not found): ${file}`);
        continue;
      }

      // Create directory
      const destDir = path.dirname(destPath);
      fs.mkdirSync(destDir, { recursive: true });

      // Read, rewrite imports, write
      let content = fs.readFileSync(srcPath, "utf-8");

      if (file.endsWith(".ts") || file.endsWith(".tsx")) {
        content = rewriteImports(content, file, config);
      }

      fs.writeFileSync(destPath, content, "utf-8");
      copiedCount++;
    }

    console.log(`  + ${name}`);
  }

  console.log(`\nCopied ${copiedCount} files to ${config.componentDir}/`);

  if (npmDeps.length > 0) {
    console.log("\nRequired npm packages:");
    console.log(`  npm install ${npmDeps.join(" ")}`);
  }

  console.log("\nDone. Components are now in your project — edit freely.");
}
