import { describe, expect, test, vi } from "vitest";
import { rewriteImports } from "../rewrite-imports.js";

describe("rewriteImports", () => {
  test("keeps same-dir imports unchanged", () => {
    const input = `import { Button } from "./Button";`;
    const result = rewriteImports(input, "Button.tsx");
    expect(result).toBe(`import { Button } from "./Button";`);
  });

  test("rewrites core imports for top-level component", () => {
    const input = `import type { Size } from "./core/types";`;
    const result = rewriteImports(input, "Button.tsx");
    expect(result).toBe(`import type { Size } from "./core/types";`);
  });

  test("rewrites parent-dir imports for core files", () => {
    const input = `import { something } from "../Button";`;
    const result = rewriteImports(input, "core/utils.ts");
    expect(result).toBe(`import { something } from "../Button";`);
  });

  test("handles export from statements", () => {
    const input = `export { Button } from "./Button";`;
    const result = rewriteImports(input, "index.ts");
    expect(result).toBe(`export { Button } from "./Button";`);
  });
});

test("keeps POSIX separators whatever the host path module uses", async () => {
  vi.doMock("node:path", async () => {
    const actual = await vi.importActual<typeof import("node:path")>("node:path");
    return { ...actual.win32, posix: actual.posix, default: actual.win32 };
  });
  vi.resetModules();
  const { rewriteImports: rewrite } = await import("../rewrite-imports.js");

  expect(rewrite('import { x } from "../Button";', "core/utils.ts")).toBe('import { x } from "../Button";');
  expect(rewrite('import { t } from "./core/types";', "Button.tsx")).toBe('import { t } from "./core/types";');
  vi.doUnmock("node:path");
});
