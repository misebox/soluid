import { createSignal } from "solid-js";

/**
 * The latest components release, read from GitHub.
 *
 * Components ship as GitHub releases rather than on npm, so the version is not
 * in package.json and has to be fetched. Both the top page badge and the
 * Getting Started config example want it, so the lookup lives here once.
 */

/** Shown until the release list loads, and if GitHub is unreachable or rate-limits us. */
export const FALLBACK_COMPONENTS_VERSION = "0.2.9";

const RELEASES_URL = "https://api.github.com/repos/misebox/soluid/releases?per_page=20";
const TAG_PREFIX = "components-v";

const [version, setVersion] = createSignal(FALLBACK_COMPONENTS_VERSION);
let started = false;

async function load(): Promise<void> {
  try {
    const res = await fetch(RELEASES_URL);
    if (!res.ok) return;
    const releases = (await res.json()) as Array<{ tag_name: string }>;
    const latest = releases.find((release) => release.tag_name.startsWith(TAG_PREFIX));
    if (latest) setVersion(latest.tag_name.slice(TAG_PREFIX.length));
  } catch {
    // Keep the fallback; a missing version is not worth an error on the page.
  }
}

/** Reactive; starts the single fetch on first read. */
export function componentsVersion(): string {
  if (!started) {
    started = true;
    void load();
  }
  return version();
}
