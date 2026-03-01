import * as fs from "node:fs";
import * as path from "node:path";
import * as readline from "node:readline";
import { CONFIG_FILENAME, findConfigPath, saveConfig } from "../config.js";
import type { SolidoutConfig } from "../config.js";
import { allComponentNames } from "../registry.js";

function prompt(question: string, defaultValue: string): Promise<string> {
	const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
	return new Promise((resolve) => {
		rl.question(`${question} (${defaultValue}) `, (answer) => {
			rl.close();
			resolve(answer.trim() || defaultValue);
		});
	});
}

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

	const componentDir = await prompt("Component directory?", "src/components/ui");
	const cssFilename = await prompt("CSS filename?", "solidout.css");

	const allNames = allComponentNames();

	const config: SolidoutConfig = {
		componentDir,
		alias: "",
		aliasBase: "src",
		cssFilename,
		components: allNames,
	};

	saveConfig(cwd, config);

	const cssDir = path.join(cwd, componentDir, "core");
	fs.mkdirSync(cssDir, { recursive: true });
	const cssPath = path.join(cssDir, cssFilename);
	if (!fs.existsSync(cssPath)) {
		fs.writeFileSync(cssPath, "", "utf-8");
	}

	const cssImportPath = `./${path.posix.join(
		path.posix.relative("src", componentDir),
		"core",
		cssFilename,
	)}`;

	console.log(`\nCreated ${CONFIG_FILENAME} with ${allNames.length} components.`);
	console.log("");
	console.log("Next steps:");
	console.log("  1. Run: npx solidout add");
	console.log("  2. Import CSS in your entry point:");
	console.log(`     import "${cssImportPath}";`);
}
