import * as fs from "node:fs";
import { createRequire } from "node:module";
import * as path from "node:path";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { createGunzip } from "node:zlib";
import { Parser, type ReadEntry } from "tar";
import { CONFIG_FILENAME, loadConfig } from "../config.js";
import { collectNpmDeps, registry, resolveDependencies } from "../registry.js";
import { rewriteImports } from "../rewrite-imports.js";

const RELEASE_URL = "https://github.com/misebox/solidout/releases/download";

function getVersion(): string {
  const require = createRequire(import.meta.url);
  return require("../../package.json").componentsVersion;
}

function checkRateLimit(res: Response): void {
  const remaining = res.headers.get("X-RateLimit-Remaining");
  if (remaining !== null && parseInt(remaining, 10) <= 5) {
    console.warn(
      `Warning: GitHub API rate limit low (${remaining} remaining)`,
    );
  }
}

async function fetchAndExtract(
  version: string,
): Promise<Map<string, string>> {
  const url = `${RELEASE_URL}/components-v${version}/components.tar.gz`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(
      `Failed to fetch components: ${res.status} ${res.statusText}\n  URL: ${url}`,
    );
  }

  checkRateLimit(res);

  const body = res.body;
  if (!body) throw new Error("Empty response body");

  const files = new Map<string, string>();
  const nodeStream = Readable.fromWeb(
    body as import("node:stream/web").ReadableStream,
  );
  const gunzip = createGunzip();
  const parser = new Parser({
    onReadEntry(entry: ReadEntry) {
      if (entry.type === "File") {
        const chunks: Buffer[] = [];
        entry.on("data", (chunk: Buffer) => chunks.push(chunk));
        entry.on("end", () => {
          let filePath = entry.path;
          if (filePath.startsWith("./")) filePath = filePath.slice(2);
          files.set(filePath, Buffer.concat(chunks).toString("utf-8"));
        });
      } else {
        entry.resume();
      }
    },
  });

  await pipeline(nodeStream, gunzip, parser);

  return files;
}

export async function add(cwd: string): Promise<void> {
  const config = loadConfig(cwd);
  if (config === null) {
    console.error(`${CONFIG_FILENAME} not found. Run: npx solidout init`);
    process.exit(1);
    return;
  }

  if (config.components.length === 0) {
    console.error("No components specified in config.");
    process.exit(1);
    return;
  }

  const invalid = config.components.filter((name) => !registry[name]);
  if (invalid.length > 0) {
    console.error(`Unknown components: ${invalid.join(", ")}`);
    process.exit(1);
    return;
  }

  const resolved = resolveDependencies(["core", ...config.components]);
  const npmDeps = collectNpmDeps(resolved);

  console.log(`Installing ${resolved.length} items (including dependencies):`);

  const version = getVersion();
  const archive = await fetchAndExtract(version);

  const targetRoot = path.resolve(cwd, config.componentDir);

  let copiedCount = 0;

  for (const name of resolved) {
    const entry = registry[name];
    if (!entry) continue;

    for (const file of entry.files) {
      const content = archive.get(file);
      if (content === undefined) {
        console.warn(`  SKIP (not in archive): ${file}`);
        continue;
      }

      const destPath = path.join(targetRoot, file);
      const destDir = path.dirname(destPath);
      fs.mkdirSync(destDir, { recursive: true });

      let output = content;
      if (file.endsWith(".ts") || file.endsWith(".tsx")) {
        output = rewriteImports(content, file, config);
      }

      fs.writeFileSync(destPath, output, "utf-8");
      copiedCount++;
    }

    console.log(`  + ${name}`);
  }

  console.log(`\nCopied ${copiedCount} files to ${config.componentDir}/`);

  if (npmDeps.length > 0) {
    console.log("\nRequired npm packages:");
    console.log(`  npm install ${npmDeps.join(" ")}`);
  }

  console.log("\nDone. Components are now in your project — edit freely.");
}
