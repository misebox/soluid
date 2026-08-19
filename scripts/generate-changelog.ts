/**
 * Turns CHANGELOG.md into data for the catalog page.
 *
 * The file is the single source: the site renders this JSON, and the release
 * scripts feed the same section to `gh release create --notes-file`. Parsed by
 * splitting on headings rather than with a YAML or Markdown dependency; the
 * shape is small enough that a parser would be the larger cost.
 */
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SOURCE = path.resolve(__dirname, "../CHANGELOG.md");
const OUT_FILE = path.resolve(__dirname, "../src/dev/changelog.json");

export interface ReleaseSection {
  /** Heading as written, e.g. `components-v0.2.10`. */
  tag: string;
  /** `components` or `cli`, from the tag prefix. */
  stream: "components" | "cli";
  version: string;
  date: string;
  /** Prose between the heading and the first group, for releases with nothing to list. */
  note?: string;
  /** `Fixed`, `Changed`, `Breaking`, ... in the order they appear. */
  groups: { title: string; entries: string[] }[];
}

/** `### components-v0.2.10 — 2026-08-19`, under a `## Components` or `## CLI` section. */
const HEADING = /^###\s+(\S+)\s+—\s+(\d{4}-\d{2}-\d{2})/;
const GROUP = /^####\s+(.+?)\s*$/;
const ENTRY = /^-\s+(.+?)\s*$/;

export function parseChangelog(markdown: string): ReleaseSection[] {
  const releases: ReleaseSection[] = [];
  let release: ReleaseSection | undefined;
  let group: { title: string; entries: string[] } | undefined;

  for (const line of markdown.split("\n")) {
    const heading = HEADING.exec(line);
    if (heading) {
      const tag = heading[1];
      const components = tag.startsWith("components-v");
      release = {
        tag,
        stream: components ? "components" : "cli",
        version: tag.replace(/^components-v|^v/, ""),
        date: heading[2],
        groups: [],
      };
      releases.push(release);
      group = undefined;
      continue;
    }
    if (!release) continue;

    const groupHeading = GROUP.exec(line);
    if (groupHeading) {
      group = { title: groupHeading[1], entries: [] };
      release.groups.push(group);
      continue;
    }

    const entry = ENTRY.exec(line);
    if (entry) {
      // Bullets outside a group belong to no section worth showing, so skip them.
      if (group) group.entries.push(entry[1]);
      continue;
    }

    // Prose before the first group: how a release with nothing to list explains itself.
    if (!group && line.trim() !== "") {
      release.note = release.note === undefined ? line.trim() : `${release.note} ${line.trim()}`;
    }
  }

  return releases;
}

/** The body for a GitHub release, rebuilt from the parsed section. */
export function notesFor(releases: ReleaseSection[], tag: string): string | undefined {
  const release = releases.find((r) => r.tag === tag);
  if (!release) return undefined;
  return release.groups
    .map((g) => `### ${g.title}\n\n${g.entries.map((e) => `- ${e}`).join("\n")}`)
    .join("\n\n")
    .concat("\n");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const releases = parseChangelog(fs.readFileSync(SOURCE, "utf-8"));
  fs.writeFileSync(OUT_FILE, JSON.stringify(releases, null, 2) + "\n", "utf-8");
  console.log(`Wrote ${releases.length} releases to ${path.relative(process.cwd(), OUT_FILE)}`);
}
