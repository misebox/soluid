import { fetchVersionOrExit, requireConfig, saveConfig } from "../config.js";
import { install } from "./install.js";

interface UpdateOptions {
  interactive?: boolean;
  force?: boolean;
}

export async function update(cwd: string, options: UpdateOptions = {}): Promise<void> {
  const config = requireConfig(cwd);

  const currentVersion = config.componentsVersion ?? "(not set)";
  console.log(`Current version: ${currentVersion}`);
  console.log("Checking for updates...");

  const latestVersion = await fetchVersionOrExit();

  if (currentVersion === latestVersion) {
    console.log(`Already up to date (${currentVersion}).`);
    return;
  }

  console.log(`Updating: ${currentVersion} -> ${latestVersion}`);
  config.componentsVersion = latestVersion;
  saveConfig(cwd, config);

  await install(cwd, { interactive: options.interactive, force: options.force });
}
