#!/usr/bin/env node

import { init } from "./commands/init.js";
import { add } from "./commands/add.js";
import { list } from "./commands/list.js";

const args = process.argv.slice(2);
const command = args[0];
const cwd = process.cwd();

switch (command) {
  case "init":
    await init(cwd);
    break;
  case "add":
    add(cwd);
    break;
  case "list": {
    const filter = args.includes("--installed")
      ? "installed" as const
      : args.includes("--not-installed")
        ? "not-installed" as const
        : "all" as const;
    list(cwd, filter);
    break;
  }
  default:
    console.log("soui - SolidJS Opinionated UI");
    console.log("");
    console.log("Commands:");
    console.log("  init                  Create soui.config.json with all components");
    console.log("  add                   Install components based on soui.config.json");
    console.log("  list [--installed]    List available components");
    console.log("       [--not-installed]");
    console.log("");
    console.log("Usage:");
    console.log("  npx soui init");
    console.log("  npx soui add");
    console.log("  npx soui list");
    break;
}
