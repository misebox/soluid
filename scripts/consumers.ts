/**
 * What every project that installed soluid is running, and what it is missing.
 *
 * Reads each `soluid.config.json` found under the search root and compares its
 * `componentsVersion` against the `components-v*` tags in this repo. Fixes are
 * counted from CHANGELOG.md, keeping only those naming a component the project
 * actually installed; the changelog starts later than the tags, so for a very
 * old project the count covers only the part it reaches.
 *
 * Run: bun scripts/consumers.ts [root]
 *   root  directory to scan (default: the tree this repo sits in)
 */

import * as fs from "fs";
import * as path from "path";
import { execFileSync } from "child_process";
import { fileURLToPath } from "url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SKIP_DIRS = new Set(["node_modules", ".git", "dist", "build", ".next", "docs", "tmp"]);
const MAX_DEPTH = 4;

interface Consumer {
  dir: string;
  version: string;
  components: string[];
}

interface Release {
  date: string;
  /** One line per entry, so a component name can be matched against the text. */
  fixes: string[];
}

function findConfigs(dir: string, depth: number): string[] {
  if (depth > MAX_DEPTH) return [];
  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return [];
  }
  if (dir !== ROOT && entries.some((e) => e.isFile() && e.name === "soluid.config.json")) {
    return [path.join(dir, "soluid.config.json")];
  }
  return entries
    .filter((e) => e.isDirectory() && !e.name.startsWith(".") && !SKIP_DIRS.has(e.name))
    .flatMap((e) => findConfigs(path.join(dir, e.name), depth + 1));
}

function readConsumer(configPath: string, root: string): Consumer | undefined {
  try {
    const config = JSON.parse(fs.readFileSync(configPath, "utf-8")) as Partial<Consumer>;
    if (typeof config.componentsVersion !== "string") return undefined;
    return {
      dir: path.relative(root, path.dirname(configPath)) || ".",
      version: config.componentsVersion,
      components: Array.isArray(config.components) ? config.components : [],
    };
  } catch {
    return undefined;
  }
}

function readReleases(): Map<string, Release> {
  const changelog = fs.readFileSync(path.join(ROOT, "CHANGELOG.md"), "utf-8");
  const releases = new Map<string, Release>();
  for (const section of changelog.split(/^### components-v/m).slice(1)) {
    const [heading, ...rest] = section.split("\n");
    const [version, date] = heading.split(" — ");
    const fixed =
      rest
        .join("\n")
        .split(/^#### /m)
        .find((part) => part.startsWith("Fixed")) ?? "";
    releases.set(version.trim(), { date: (date ?? "").trim(), fixes: fixed.split(/^- /m).slice(1) });
  }
  return releases;
}

function compareVersions(a: string, b: string): number {
  const parts = (v: string) => v.split(".").map(Number);
  const [x, y] = [parts(a), parts(b)];
  for (let i = 0; i < Math.max(x.length, y.length); i += 1) {
    const diff = (x[i] ?? 0) - (y[i] ?? 0);
    if (diff !== 0) return diff;
  }
  return 0;
}

/** Components named in backticks anywhere in the entry. */
function componentsNamedIn(entry: string): Set<string> {
  const names = new Set<string>();
  for (const [, name] of entry.matchAll(/`([A-Z][A-Za-z]+)`/g)) names.add(name);
  return names;
}

/** Oldest first. The tags are the record of what shipped; the changelog is not. */
function releasedVersions(): string[] {
  try {
    const tags = execFileSync("git", ["tag", "-l", "components-v*", "--sort=v:refname"], {
      cwd: ROOT,
      encoding: "utf-8",
    });
    return tags
      .split("\n")
      .filter(Boolean)
      .map((tag) => tag.replace("components-v", ""));
  } catch {
    return [];
  }
}

function report(root: string): number {
  const releases = readReleases();
  const versions = releasedVersions();
  const latest = versions[versions.length - 1];
  if (!latest) {
    console.error("No components-v* tag found. Run this from a full clone.");
    return 1;
  }
  const changelogFrom = [...releases.keys()].sort(compareVersions)[0];

  const consumers = findConfigs(root, 0)
    .map((configPath) => readConsumer(configPath, root))
    .filter((c): c is Consumer => c !== undefined)
    .sort((a, b) => compareVersions(a.version, b.version));

  if (consumers.length === 0) {
    console.log(`No soluid.config.json found under ${root}`);
    return 0;
  }

  const count = consumers.length === 1 ? "1 project" : `${consumers.length} projects`;
  console.log(`soluid components ${latest} — ${count} under ${root}\n`);

  for (const consumer of consumers) {
    const behind = versions.filter((v) => compareVersions(v, consumer.version) > 0);
    if (behind.length === 0) {
      console.log(`  ${consumer.version}  ${consumer.dir}  (current)`);
      continue;
    }

    const installed = new Set(consumer.components);
    const affected = new Set<string>();
    let fixes = 0;
    let since = "";
    for (const version of behind) {
      const release = releases.get(version);
      if (!release) continue;
      if (!since) since = release.date;
      for (const fix of release.fixes) {
        const named = [...componentsNamedIn(fix)].filter((name) => installed.has(name));
        if (named.length === 0) continue;
        fixes += 1;
        for (const name of named) affected.add(name);
      }
    }

    const partial = compareVersions(consumer.version, changelogFrom) < 0;
    const scope = partial ? `${fixes}+ fixes` : `${fixes} fixes`;
    console.log(
      `  ${consumer.version}  ${consumer.dir}  ${behind.length} behind` +
        `${since ? `, oldest listed ${since}` : ""}, ${scope} touch components it uses`,
    );
    if (affected.size > 0) console.log(`      ${[...affected].sort().join(", ")}`);
  }

  if (changelogFrom) console.log(`\n  "+" means the changelog only reaches back to ${changelogFrom}.`);
  console.log("  soluid update  in a project directory to move it to the current release.");
  return 0;
}

process.exit(report(path.resolve(process.argv[2] ?? path.join(ROOT, "..", ".."))));
