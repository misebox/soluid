import { PROJECT_NAME, requireConfig, saveConfig } from "../config.js";

export function remove(cwd: string, names: string[]): void {
  const config = requireConfig(cwd);

  const existing = new Set(config.components);
  const notInConfig = names.filter((name) => !existing.has(name));
  if (notInConfig.length > 0) {
    console.warn(`Not in config (skipped): ${notInConfig.join(", ")}`);
  }

  const removed = names.filter((name) => existing.has(name));

  if (removed.length === 0) {
    console.log("None of the specified components are in config.");
    return;
  }

  const toRemove = new Set(removed);
  config.components = config.components.filter((c) => !toRemove.has(c));

  saveConfig(cwd, config);
  console.log(`Removed: ${removed.join(", ")}`);
  console.log(`\nRun: npx ${PROJECT_NAME} install`);
}
