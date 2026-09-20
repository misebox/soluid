import { readFileSync } from "node:fs";
import { expect, it } from "vitest";
import { parseChangelog } from "../generate-changelog";

/**
 * The catalog's release notes are parsed out of CHANGELOG.md, so a heading the
 * parser does not recognise does not fail: its entries are filed under whatever
 * release came before it.
 */

const CHANGELOG = `# Changelog

## Components

### Unreleased

#### Fixed

- Not shipped yet.

### components-v0.2.2 — 2026-08-20

#### Fixed

- The real one.

## CLI

### Unreleased

#### Fixed

- Also not shipped yet.

### v0.2.1 — 2026-08-19

#### Fixed

- The CLI one.
`;

it("files each entry under the release it was published in", () => {
  const releases = parseChangelog(CHANGELOG);

  expect(releases.map((r) => r.tag)).toEqual(["components-v0.2.2", "v0.2.1"]);
  // Exactly one group each: an absorbed `### Unreleased` arrives as a second.
  expect(releases.map((r) => r.groups.length)).toEqual([1, 1]);
  expect(releases[0]?.groups[0]?.entries).toEqual(["The real one."]);
  expect(releases[1]?.groups[0]?.entries).toEqual(["The CLI one."]);
});

it("drops entries under a heading carrying no release date", () => {
  const everything = JSON.stringify(parseChangelog(CHANGELOG));

  expect(everything).not.toContain("not shipped yet");
});

it("keeps this repo's own unreleased entries out of every release", () => {
  const markdown = readFileSync("CHANGELOG.md", "utf-8");
  const unreleased = markdown
    .split(/^### /m)
    .filter((section) => section.startsWith("Unreleased"))
    .flatMap((section) => [...section.matchAll(/^- (.+)$/gm)].map((m) => m[1]));
  const published = JSON.stringify(parseChangelog(markdown));

  for (const entry of unreleased) expect(published).not.toContain(entry);
});
