import { CONFIG_FILENAME, PROJECT_NAME, loadConfig, saveConfig } from "../config.js";
import { registry } from "../registry.js";

export function add(cwd: string, names: string[]): void {
	const config = loadConfig(cwd);
	if (config === null) {
		console.error(`${CONFIG_FILENAME} not found. Run: npx ${PROJECT_NAME} init`);
		process.exit(1);
		return;
	}

	const invalid = names.filter((name) => !registry[name]);
	if (invalid.length > 0) {
		console.error(`Unknown components: ${invalid.join(", ")}`);
		process.exit(1);
		return;
	}

	const existing = new Set(config.components);
	const added: string[] = [];
	for (const name of names) {
		if (!existing.has(name)) {
			config.components.push(name);
			added.push(name);
		}
	}

	if (added.length === 0) {
		console.log("All specified components are already in config.");
		return;
	}

	saveConfig(cwd, config);
	console.log(`Added: ${added.join(", ")}`);
	console.log(`\nRun: npx ${PROJECT_NAME} install`);
}
