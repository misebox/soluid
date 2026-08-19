import { For, Show } from "solid-js";
import { Badge } from "../../components/ui/soluid/Badge";
import changelog from "../changelog.json";
import { lang } from "../lang";
import { t } from "../locales";

interface ReleaseSection {
  tag: string;
  stream: "components" | "cli";
  version: string;
  date: string;
  note?: string;
  groups: { title: string; entries: string[] }[];
}

const releases = changelog as ReleaseSection[];

/** Breaking changes are the one thing a reader must not skim past. */
const variantFor = (title: string) => (title.toLowerCase() === "breaking" ? "danger" : "neutral");

/**
 * Renders the inline code spans of a changelog line.
 *
 * The entries are Markdown, because the same file is what GitHub renders on the
 * release. Backticks are the only markup used, so splitting on them beats
 * pulling in a Markdown parser.
 */
function Entry(props: { text: string }) {
  const parts = () => props.text.split("`");
  return <For each={parts()}>{(part, i) => (i() % 2 === 1 ? <code>{part}</code> : <>{part}</>)}</For>;
}

export function ChangelogPage() {
  return (
    <div class="changelog-page">
      <h1>{t(lang(), "nav.changelog")}</h1>
      <p class="changelog-lead">{t(lang(), "changelog.lead")}</p>

      <For each={releases}>
        {(release) => (
          <section class="changelog-release">
            <h2 class="changelog-tag">
              <a
                href={`https://github.com/misebox/soluid/releases/tag/${release.tag}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {release.tag}
              </a>
              <Badge variant={release.stream === "components" ? "primary" : "neutral"} size="sm">
                {release.stream}
              </Badge>
              <time class="changelog-date">{release.date}</time>
            </h2>

            <Show when={release.note}>
              {(note) => (
                <p class="changelog-note">
                  <Entry text={note()} />
                </p>
              )}
            </Show>

            <For each={release.groups}>
              {(group) => (
                <div class="changelog-group">
                  <h3>
                    <Badge variant={variantFor(group.title)} size="sm">
                      {group.title}
                    </Badge>
                  </h3>
                  <ul>
                    <For each={group.entries}>
                      {(entry) => (
                        <li>
                          <Entry text={entry} />
                        </li>
                      )}
                    </For>
                  </ul>
                </div>
              )}
            </For>
          </section>
        )}
      </For>
    </div>
  );
}
