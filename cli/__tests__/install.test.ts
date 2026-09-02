import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import * as tar from "tar";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { add } from "../commands/add.js";
import { install } from "../commands/install.js";
import { update } from "../commands/update.js";
import { CONFIG_FILENAME, fetchLatestComponentsVersion, loadConfig } from "../config.js";
import { registry } from "../registry.js";

vi.mock("../prompt.js", () => ({ prompt: async (_q: string, d: string) => d, confirm: async () => true }));

class ExitError extends Error {
  constructor(public code: unknown) {
    super(`exit ${code}`);
  }
}

const CORE_FILES = [...registry.core.files];

let proj: string;
let logs: string[];
let errors: string[];

beforeEach(() => {
  proj = fs.mkdtempSync(path.join(os.tmpdir(), "soluid-install-"));
  logs = [];
  errors = [];
  vi.spyOn(console, "log").mockImplementation((...args) => logs.push(args.join(" ")));
  vi.spyOn(console, "warn").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation((...args) => errors.push(args.join(" ")));
  vi.spyOn(process, "exit").mockImplementation((code) => {
    throw new ExitError(code);
  });
});

afterEach(() => {
  registry.core.files = [...CORE_FILES];
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  fs.rmSync(proj, { recursive: true, force: true });
});

/** Minimal file bodies for the given registry entries. */
function fixtureFor(names: string[], overrides: Record<string, string> = {}): Record<string, string> {
  const files: Record<string, string> = {};
  for (const name of names) {
    for (const file of registry[name].files) files[file] = file.endsWith(".css") ? `.x{}\n` : `export const x = 1;\n`;
  }
  return { ...files, ...overrides };
}

async function makeArchive(files: Record<string, string>): Promise<Buffer> {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "soluid-archive-"));
  for (const [file, content] of Object.entries(files)) {
    fs.mkdirSync(path.dirname(path.join(dir, file)), { recursive: true });
    fs.writeFileSync(path.join(dir, file), content);
  }
  const chunks: Buffer[] = [];
  for await (const chunk of tar.create({ cwd: dir, gzip: true }, ["."])) chunks.push(chunk as Buffer);
  fs.rmSync(dir, { recursive: true, force: true });
  return Buffer.concat(chunks);
}

function stubArchiveFetch(archive: Buffer, latest = "9.9.9") {
  vi.stubGlobal("fetch", async (url: string) =>
    url.includes("api.github.com")
      ? new Response(JSON.stringify([{ tag_name: `components-v${latest}` }]))
      : new Response(new Uint8Array(archive)),
  );
}

function writeConfig(components: string[], extra: Record<string, unknown> = {}) {
  fs.writeFileSync(
    path.join(proj, CONFIG_FILENAME),
    JSON.stringify({
      componentsVersion: "0.2.7",
      componentDir: "src/ui",
      cssPath: "src/soluid.css",
      components,
      ...extra,
    }),
  );
  fs.writeFileSync(
    path.join(proj, "package.json"),
    JSON.stringify({ dependencies: { "@solid-primitives/event-listener": "1" } }),
  );
}

async function exitCodeOf(run: () => Promise<void>): Promise<unknown> {
  try {
    await run();
    return "not called";
  } catch (e) {
    if (e instanceof ExitError) return e.code;
    throw e;
  }
}

describe("install drift checks", () => {
  test("a release with files this CLI does not know is refused", async () => {
    registry.core.files = CORE_FILES.filter((f) => f !== "soluid/core/createScrollLock.ts");
    stubArchiveFetch(
      await makeArchive(fixtureFor(["core", "Button"], { "soluid/core/createScrollLock.ts": "export {};\n" })),
    );
    writeConfig(["Button"]);

    expect(await exitCodeOf(() => install(proj, { interactive: false }))).toBe(1);
    expect(errors.join("\n")).toContain("createScrollLock.ts");
    expect(fs.existsSync(path.join(proj, "src/ui/Button.tsx"))).toBe(false);
  });

  test("a release lacking a file this CLI expects is refused", async () => {
    const files = fixtureFor(["core", "Button"]);
    delete files["soluid/core/createScrollLock.ts"];
    stubArchiveFetch(await makeArchive(files));
    writeConfig(["Button"]);

    expect(await exitCodeOf(() => install(proj, { interactive: false }))).toBe(1);
    expect(fs.existsSync(path.join(proj, "src/ui/Button.tsx"))).toBe(false);
  });

  test("a matching release installs", async () => {
    stubArchiveFetch(await makeArchive(fixtureFor(["core", "Button"])));
    writeConfig(["Button"]);

    await install(proj, { interactive: false });

    expect(fs.existsSync(path.join(proj, "src/ui/Button.tsx"))).toBe(true);
    expect(fs.existsSync(path.join(proj, "src/ui/core/createScrollLock.ts"))).toBe(true);
  });
});

test("an interactive install lists each component once", async () => {
  stubArchiveFetch(await makeArchive(fixtureFor(["core", "Button"])));
  writeConfig(["Button"]);

  await install(proj, { interactive: true });

  expect(logs.filter((line) => line === "  + Button")).toHaveLength(1);
});

test("add does not write a name twice", () => {
  writeConfig([]);

  add(proj, ["Button", "Button"]);

  expect(loadConfig(proj)?.components).toEqual(["Button"]);
});

test("the latest components version skips pre-releases and drafts", async () => {
  vi.stubGlobal(
    "fetch",
    async () =>
      new Response(
        JSON.stringify([
          { tag_name: "components-v0.3.0-beta.1", prerelease: true, draft: false },
          { tag_name: "components-v0.2.12", prerelease: false, draft: false },
        ]),
      ),
  );

  await expect(fetchLatestComponentsVersion()).resolves.toBe("0.2.12");
});

test("update keeps the old version in the config when the install is refused", async () => {
  registry.core.files = CORE_FILES.filter((f) => f !== "soluid/core/createScrollLock.ts");
  stubArchiveFetch(
    await makeArchive(fixtureFor(["core", "Button"], { "soluid/core/createScrollLock.ts": "export {};\n" })),
  );
  writeConfig(["Button"]);

  expect(await exitCodeOf(() => update(proj, { interactive: false }))).toBe(1);

  expect(loadConfig(proj)?.componentsVersion).toBe("0.2.7");
});

test("update records the new version once the install went through", async () => {
  stubArchiveFetch(await makeArchive(fixtureFor(["core", "Button"])), "1.2.3");
  writeConfig(["Button"]);

  await update(proj, { interactive: false });

  expect(loadConfig(proj)?.componentsVersion).toBe("1.2.3");
});

test("a non-interactive install keeps files that differ unless --force is passed", async () => {
  stubArchiveFetch(await makeArchive(fixtureFor(["core", "Button"])));
  writeConfig(["Button"]);
  await install(proj, { interactive: false });
  const file = path.join(proj, "src/ui/Button.tsx");
  fs.writeFileSync(file, "// edited locally\n");

  await install(proj, { interactive: false });
  expect(fs.readFileSync(file, "utf-8")).toBe("// edited locally\n");
  expect(logs.some((line) => line.includes("--force"))).toBe(true);

  await install(proj, { interactive: false, force: true });
  expect(fs.readFileSync(file, "utf-8")).not.toBe("// edited locally\n");
});
