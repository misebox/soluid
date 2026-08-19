/**
 * Prints the CHANGELOG section for a tag, for `gh release --notes-file`.
 *
 * Exits non-zero when the tag has no section, which is how the release scripts
 * refuse to publish a release with nothing written about it.
 */
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { notesFor, parseChangelog } from "./generate-changelog";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const tag = process.argv[2];
if (!tag) {
  console.error("Usage: release-notes.ts <tag>");
  process.exit(1);
}

const markdown = fs.readFileSync(path.resolve(__dirname, "../CHANGELOG.md"), "utf-8");
const notes = notesFor(parseChangelog(markdown), tag);

if (notes === undefined) {
  console.error(`No CHANGELOG.md section for ${tag}`);
  process.exit(1);
}

process.stdout.write(notes);
