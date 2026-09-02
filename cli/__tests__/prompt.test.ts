import { PassThrough } from "node:stream";
import { afterEach, expect, test } from "vitest";
import { confirm, prompt } from "../prompt.js";

const realStdin = process.stdin;

afterEach(() => {
  Object.defineProperty(process, "stdin", { value: realStdin, configurable: true });
});

function closeStdin() {
  const stream = new PassThrough();
  Object.defineProperty(process, "stdin", { value: stream, configurable: true });
  stream.end();
}

test("prompt takes the default when stdin ends without an answer", async () => {
  closeStdin();

  await expect(prompt("Name?", "fallback")).resolves.toBe("fallback");
});

test("confirm answers no when stdin ends without an answer", async () => {
  closeStdin();

  await expect(confirm("Sure? ")).resolves.toBe(false);
});

test("prompt returns what was typed, not the default", async () => {
  const stream = new PassThrough();
  Object.defineProperty(process, "stdin", { value: stream, configurable: true });
  const answer = prompt("Name?", "fallback");
  stream.write("Alice\n");

  await expect(answer).resolves.toBe("Alice");
});

test("confirm reads a yes", async () => {
  const stream = new PassThrough();
  Object.defineProperty(process, "stdin", { value: stream, configurable: true });
  const answer = confirm("Sure? ");
  stream.write("y\n");

  await expect(answer).resolves.toBe(true);
});

test("confirm accepts the long form the question invites", async () => {
  // init asks "Continue anyway? (y/n)", so "yes" cannot mean no.
  for (const [typed, expected] of [
    ["y", true],
    ["Y", true],
    ["yes", true],
    ["YES", true],
    ["n", false],
    ["", false],
    ["nope", false],
  ] as const) {
    const stream = new PassThrough();
    Object.defineProperty(process, "stdin", { value: stream, configurable: true });
    const answer = confirm("Sure? ");
    stream.write(`${typed}\n`);

    await expect(answer, typed).resolves.toBe(expected);
  }
});
