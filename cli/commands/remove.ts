import { CONFIG_FILENAME, PROJECT_NAME, loadConfig, saveConfig } from "../config.js";

export function remove(cwd: string, names: string[]): void {
	const config = loadConfig(cwd);
	if (config === null) {
		console.error(`${CONFIG_FILENAME} not found. Run: npx ${PROJECT_NAME} init`);
		process.exit(1);
		return;
	}

	const existing = new Set(config.components);
	const removed: string[] = [];
	for (const name of names) {
		if (existing.has(name)) {
			removed.push(name);
		}
	}

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
