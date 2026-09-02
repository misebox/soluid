import * as readline from "node:readline";

export function prompt(question: string, defaultValue: string): Promise<string> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    // stdin at end of file (CI, a closed pipe) never answers; take the default.
    rl.once("close", () => resolve(defaultValue));
    rl.question(`${question} (${defaultValue}) `, (answer) => {
      rl.close();
      resolve(answer.trim() || defaultValue);
    });
  });
}

export function confirm(question: string): Promise<boolean> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.once("close", () => resolve(false));
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase() === "y");
    });
  });
}
