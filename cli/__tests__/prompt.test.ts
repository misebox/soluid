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
