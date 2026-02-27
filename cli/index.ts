#!/usr/bin/env node

import { init } from "./commands/init.js";
import { add } from "./commands/add.js";

const args = process.argv.slice(2);
const command = args[0];
const cwd = process.cwd();

switch (command) {
  case "init":
    init(cwd);
    break;
  case "add":
    add(cwd);
    break;
  default:
    console.log("soui - SolidJS Opinionated UI");
    console.log("");
    console.log("Commands:");
    console.log("  init    Create soui.config.json with all components");
    console.log("  add     Install components based on soui.config.json");
    console.log("");
    console.log("Usage:");
    console.log("  npx soui init");
    console.log("  npx soui add");
    break;
}
