#!/usr/bin/env node

import { add } from "./commands/add.js";
import { init } from "./commands/init.js";
import { install } from "./commands/install.js";
import { list } from "./commands/list.js";
import { remove } from "./commands/remove.js";
import { update } from "./commands/update.js";
import { CONFIG_FILENAME, PROJECT_NAME } from "./config.js";

const args = process.argv.slice(2);
const command = args[0];
const rest = args.slice(1);
const cwd = process.cwd();

function printHelp(): void {
  const commands: [string, string][] = [
    [`init [--no-interactive]`, `Create ${CONFIG_FILENAME}`],
    ["install [--no-interactive] [--force]", "Install components and CSS"],
    ["update [--no-interactive] [--force]", "Update to the latest components version"],
    ["add <component...>", "Add components to config"],
    ["remove <component...>", "Remove components from config"],
    ["list [--installed] [--not-installed]", "List available components"],
  ];
  const options: [string, string][] = [
    [
      "--no-interactive",
      "Skip the prompts. Missing npm packages are installed without asking, rather than only being printed.",
    ],
    ["--force", "Overwrite files that differ locally, and skip every prompt."],
    ["--help, -h", "Show this help."],
  ];
  // Padded from the data so the columns cannot drift as entries are edited.
  const pad = (rows: [string, string][]) => {
    const width = Math.max(...rows.map(([left]) => left.length));
    return rows.map(([left, right]) => `  ${left.padEnd(width)}  ${right}`);
  };

  console.log(`${PROJECT_NAME} - CLI that installs SolidJS UI components into your project`);
  console.log("");
  console.log("Commands:");
  for (const line of pad(commands)) console.log(line);
  console.log("");
  console.log("Options:");
  for (const line of pad(options)) console.log(line);
}

// Checked before dispatch: `soluid install --help` used to run the install.
if (args.includes("--help") || args.includes("-h")) {
  printHelp();
  process.exit(0);
}

switch (command) {
  case "init":
    await init(cwd, { interactive: !args.includes("--no-interactive") });
    break;
  case "install":
    await install(cwd, { interactive: !args.includes("--no-interactive"), force: args.includes("--force") });
    break;
  case "add":
    if (rest.length === 0) {
      console.error(`Usage: npx ${PROJECT_NAME} add <component...>`);
      process.exit(1);
    }
    add(cwd, rest);
    break;
  case "remove":
    if (rest.length === 0) {
      console.error(`Usage: npx ${PROJECT_NAME} remove <component...>`);
      process.exit(1);
    }
    remove(cwd, rest);
    break;
  case "update":
    await update(cwd, { interactive: !args.includes("--no-interactive"), force: args.includes("--force") });
    break;
  case "list": {
    const filter = args.includes("--installed")
      ? ("installed" as const)
      : args.includes("--not-installed")
        ? ("not-installed" as const)
        : ("all" as const);
    list(cwd, filter);
    break;
  }
  default:
    printHelp();
    break;
}
