import { execSync } from "node:child_process";
import * as fs from "node:fs";
import * as path from "node:path";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { createGunzip } from "node:zlib";
import { Parser, type ReadEntry } from "tar";
import {
  COLOR_OVERRIDE_KEYS,
  type ColorOverrideKey,
  fetchVersionOrExit,
  PROJECT_NAME,
  RELEASE_URL,
  requireConfig,
  saveConfig,
  type SoluidConfig,
} from "../config.js";
import { confirm } from "../prompt.js";
import { collectNpmDeps, registry, resolveDependencies } from "../registry.js";
import { rewriteImports } from "../rewrite-imports.js";

const ARCHIVE_PREFIX = "soluid/";

function detectInstallCommand(cwd: string): { lockfile: string | null; command: string[] } {
  const lockfiles: Record<string, string[]> = {
    "bun.lockb": ["bun", "add"],
    "bun.lock": ["bun", "add"],
    "pnpm-lock.yaml": ["pnpm", "add"],
    "yarn.lock": ["yarn", "add"],
    "package-lock.json": ["npm", "install"],
  };
  for (const [lockfile, command] of Object.entries(lockfiles)) {
    if (fs.existsSync(path.join(cwd, lockfile))) return { lockfile, command };
  }
  if (fs.existsSync(path.join(cwd, "bunfig.toml"))) {
    return { lockfile: "bunfig.toml", command: ["bun", "add"] };
  }
  return { lockfile: null, command: ["npm", "install"] };
}

function checkRateLimit(res: Response): void {
  const remaining = res.headers.get("X-RateLimit-Remaining");
  if (remaining !== null && parseInt(remaining, 10) <= 5) {
    console.warn(`Warning: GitHub API rate limit low (${remaining} remaining)`);
  }
}

async function fetchAndExtract(version: string): Promise<Map<string, string>> {
  const url = `${RELEASE_URL}/components-v${version}/components.tar.gz`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Failed to fetch components: ${res.status} ${res.statusText}\n  URL: ${url}`);
  }

  checkRateLimit(res);

  const body = res.body;
  if (!body) throw new Error("Empty response body");

  const files = new Map<string, string>();
  const nodeStream = Readable.fromWeb(body as import("node:stream/web").ReadableStream);
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

function stripPrefix(archivePath: string): string {
  if (archivePath.startsWith(ARCHIVE_PREFIX)) {
    return archivePath.slice(ARCHIVE_PREFIX.length);
  }
  return archivePath;
}

interface WriteResult {
  addedCount: number;
  updatedCount: number;
  cssChunks: string[];
  installedModules: string[];
  /** Files left alone because they differ locally and overwriting was declined. */
  kept: string[];
}

interface WriteOptions {
  /** Replace files whose local content differs from the release. */
  overwrite: boolean;
  /** Report what would change without touching the disk. */
  dryRun?: boolean;
}

function writeComponentFiles(
  archive: Map<string, string>,
  resolved: string[],
  targetRoot: string,
  options: WriteOptions,
): WriteResult {
  let addedCount = 0;
  let updatedCount = 0;
  const cssChunks: string[] = [];
  const installedModules: string[] = [];
  const kept: string[] = [];

  for (const name of resolved) {
    const entry = registry[name];
    if (!entry) continue;

    let status: "added" | "updated" | "unchanged" = "unchanged";

    for (const file of entry.files) {
      const content = archive.get(file);
      if (content === undefined) continue;

      const localPath = stripPrefix(file);

      if (file.endsWith(".css")) {
        cssChunks.push(`/* ${localPath} */\n${content}`);
        continue;
      }

      const destPath = path.join(targetRoot, localPath);
      const destDir = path.dirname(destPath);

      let output = content;
      if (file.endsWith(".ts") || file.endsWith(".tsx")) {
        output = rewriteImports(content, localPath);
        installedModules.push(localPath);
      }

      const isNew = !fs.existsSync(destPath);
      if (!isNew) {
        const existing = fs.readFileSync(destPath, "utf-8");
        if (existing === output) continue;
        // Differs from the release: either an older version or a local edit.
        // Nothing here can tell the two apart, so the caller decides.
        if (!options.overwrite) {
          kept.push(localPath);
          continue;
        }
      }

      if (!options.dryRun) {
        fs.mkdirSync(destDir, { recursive: true });
        fs.writeFileSync(destPath, output, "utf-8");
      }

      if (isNew) {
        status = "added";
        addedCount++;
      } else if (status !== "added") {
        status = "updated";
        updatedCount++;
      }
    }

    if (options.dryRun) continue;
    if (status === "added") {
      console.log(`  + ${name}`);
    } else if (status === "updated") {
      console.log(`  ~ ${name}`);
    }
  }

  return { addedCount, updatedCount, cssChunks, installedModules, kept };
}

function generateBarrelIndex(installedModules: string[], targetRoot: string): void {
  const coreModules = installedModules.filter((p) => p.startsWith("core/"));
  const componentModules = installedModules.filter((p) => !p.startsWith("core/"));
  const indexLines = [
    "// Auto-generated by soluid CLI",
    ...[...coreModules, ...componentModules].map((p) => `export * from "./${p.replace(/\.tsx?$/, "")}"`),
    "",
  ];
  fs.writeFileSync(path.join(targetRoot, "index.ts"), indexLines.join("\n"), "utf-8");
}

function buildColorOverrideBlock(colors: SoluidConfig["colors"]): string {
  if (!colors) return "";
  const lines: string[] = [];
  for (const key of COLOR_OVERRIDE_KEYS) {
    const value = colors[key as ColorOverrideKey];
    if (typeof value === "string" && value.length > 0) {
      lines.push(`  --so-color-${key}-base: ${value};`);
    }
  }
  if (lines.length === 0) return "";
  return ["", "/* === user overrides (from soluid.config.json) === */", ":root {", ...lines, "}", ""].join("\n");
}

function writeConcatenatedCss(cssChunks: string[], cssPath: string, cwd: string, config: SoluidConfig): void {
  if (cssChunks.length === 0) return;

  const cssDestPath = path.resolve(cwd, cssPath);
  const overrideBlock = buildColorOverrideBlock(config.colors);
  const cssContent = cssChunks.join("\n\n") + "\n" + overrideBlock;
  const cssUnchanged = fs.existsSync(cssDestPath) && fs.readFileSync(cssDestPath, "utf-8") === cssContent;
  if (!cssUnchanged) {
    const cssDestDir = path.dirname(cssDestPath);
    fs.mkdirSync(cssDestDir, { recursive: true });
    fs.writeFileSync(cssDestPath, cssContent, "utf-8");
    console.log(`\nCSS written to ${cssPath}`);
  }
}

async function installNpmDependencies(npmDeps: string[], cwd: string, interactive: boolean): Promise<void> {
  const pkgJsonPath = path.join(cwd, "package.json");
  let installedPkgs: Set<string> = new Set();
  if (fs.existsSync(pkgJsonPath)) {
    const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, "utf-8"));
    const allDeps = { ...pkgJson.dependencies, ...pkgJson.devDependencies };
    installedPkgs = new Set(Object.keys(allDeps));
  }
  const missingDeps = npmDeps.filter((d) => !installedPkgs.has(d));
  if (missingDeps.length === 0) return;

  const { lockfile, command } = detectInstallCommand(cwd);
  if (lockfile) {
    console.log(`\nFound ${lockfile}`);
  }
  const cmd = [...command, ...missingDeps].join(" ");
  console.log(`Required packages: ${missingDeps.join(", ")}`);

  if (interactive) {
    const ok = await confirm(`Run \`${cmd}\`? [y/N] `);
    if (ok) {
      execSync(cmd, { stdio: "inherit", cwd });
    } else {
      console.log(`  ${cmd}`);
    }
  } else {
    console.log(`Running: ${cmd}`);
    execSync(cmd, { stdio: "inherit", cwd });
  }
}

interface InstallOptions {
  interactive?: boolean;
  /** Overwrite locally changed files, and skip every prompt. */
  force?: boolean;
  /** Install this release instead of the one in the config; recorded once it succeeds. */
  version?: string;
}

/**
 * The file manifest ships with the CLI while the files ship with the release,
 * so the two can drift: a release can carry files this CLI has never heard of
 * (its components would import something never installed), or lack files this
 * CLI expects. Either way the install would be broken, so stop here.
 */
function checkDrift(archive: Map<string, string>, resolved: string[], version: string): void {
  const known = new Set(Object.values(registry).flatMap((entry) => entry.files));
  const unknown = [...archive.keys()].filter((file) => /^soluid\/.*\.tsx?$/.test(file) && !known.has(file));
  if (unknown.length > 0) {
    console.error(`components v${version} contains files this CLI does not know:\n  ${unknown.join("\n  ")}`);
    console.error(`Upgrade the CLI: npx ${PROJECT_NAME}@latest install`);
    process.exit(1);
  }
  const missing = resolved.flatMap((name) => registry[name].files.filter((file) => !archive.has(file)));
  if (missing.length > 0) {
    console.error(`components v${version} lacks files this CLI expects:\n  ${missing.join("\n  ")}`);
    console.error(
      `Set componentsVersion to a newer release, or use the matching CLI: npx ${PROJECT_NAME}@<version> install`,
    );
    process.exit(1);
  }
}

export async function install(cwd: string, options: InstallOptions = {}): Promise<void> {
  const force = options.force === true;
  // --force answers the prompts too, so it implies non-interactive.
  const interactive = options.interactive !== false && !force;
  const config = requireConfig(cwd);

  if (config.components.length === 0) {
    console.error("No components specified in config.");
    process.exit(1);
    return;
  }

  const invalid = config.components.filter((name) => !registry[name]);
  if (invalid.length > 0) {
    console.error(`Unknown components: ${invalid.join(", ")} (not in this CLI's registry)`);
    console.error(`Upgrade the CLI: npx ${PROJECT_NAME}@latest install`);
    process.exit(1);
    return;
  }

  const resolved = resolveDependencies(["core", ...config.components]);
  const npmDeps = collectNpmDeps(resolved);

  console.log(`Installing ${resolved.length} items (including dependencies):`);

  let version = options.version ?? config.componentsVersion;
  if (!version) {
    console.log("No componentsVersion in config, fetching latest...");
    version = await fetchVersionOrExit();
    config.componentsVersion = version;
    saveConfig(cwd, config);
    console.log(`Using components v${version}`);
  }

  let archive: Map<string, string>;
  try {
    archive = await fetchAndExtract(version);
  } catch (e) {
    console.error(`Failed to fetch components: ${e instanceof Error ? e.message : e}`);
    process.exit(1);
    return;
  }

  checkDrift(archive, resolved, version);

  const targetRoot = path.resolve(cwd, config.componentDir);

  // Ask before replacing files that differ locally. Committed work is safe in
  // git either way; this is about edits that have not been committed yet.
  // Without a terminal to ask, only --force may replace them.
  let overwrite = force;
  if (interactive) {
    const preview = writeComponentFiles(archive, resolved, targetRoot, { overwrite: false, dryRun: true });
    if (preview.kept.length > 0) {
      console.log(`\n${preview.kept.length} file(s) differ from components v${version}:`);
      for (const file of preview.kept) console.log(`  ${file}`);
      overwrite = await confirm("Overwrite them? [y/N] ");
    }
  }

  const { addedCount, updatedCount, cssChunks, installedModules, kept } = writeComponentFiles(
    archive,
    resolved,
    targetRoot,
    { overwrite },
  );

  generateBarrelIndex(installedModules, targetRoot);
  writeConcatenatedCss(cssChunks, config.cssPath, cwd, config);

  if (config.componentsVersion !== version) {
    config.componentsVersion = version;
    saveConfig(cwd, config);
  }

  // Files of components dropped from the config are the user's now; say so
  // rather than deleting them.
  const wanted = new Set(resolved.flatMap((name) => registry[name].files.map(stripPrefix)));
  const stale = Object.values(registry)
    .flatMap((entry) => entry.files.map(stripPrefix))
    .filter((file) => !wanted.has(file) && !file.endsWith(".css") && fs.existsSync(path.join(targetRoot, file)));
  if (stale.length > 0) console.log(`Not in config, left in place: ${stale.join(", ")}`);

  if (addedCount === 0 && updatedCount === 0) {
    console.log("\nAll components are up to date.");
  } else {
    const parts: string[] = [];
    if (addedCount > 0) parts.push(`${addedCount} added`);
    if (updatedCount > 0) parts.push(`${updatedCount} updated`);
    console.log(`\n${parts.join(", ")} in ${config.componentDir}/`);
  }

  if (kept.length > 0) {
    console.log(`${kept.length} left unchanged. Pass --force to overwrite.`);
  }

  if (npmDeps.length > 0) {
    await installNpmDependencies(npmDeps, cwd, interactive);
  }

  console.log("\nDone. Components are now in your project — edit freely.");
}
