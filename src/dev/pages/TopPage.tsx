import { A } from "@solidjs/router";
import { createSignal, For, Show } from "solid-js";
import { Dialog, DialogBody, DialogHeader } from "../../components/ui/soluid/Dialog";
import { IconButton } from "../../components/ui/soluid/IconButton";
import { componentsVersion } from "../componentsVersion";
import { lang } from "../lang";
import { t } from "../locales";

const categories = [
  { slug: "layout", labelKey: "cat.layout", components: "Stack, Grid, Container, AspectRatio, Divider, Spacer" },
  { slug: "general", labelKey: "cat.general", components: "Button, Heading, Text, Link, Badge, Tag, Avatar, Tooltip" },
  {
    slug: "form",
    labelKey: "cat.form",
    components: "TextField, Select, Combobox, Checkbox, Switch, Slider, Rating, FileUpload",
  },
  { slug: "data", labelKey: "cat.data", components: "Table, Card, Stat, Timeline, Tree, Accordion, Collapsible" },
  { slug: "feedback", labelKey: "cat.feedback", components: "Dialog, Drawer, Alert, Toast, Progress, Spinner" },
  {
    slug: "navigation",
    labelKey: "cat.navigation",
    components: "Tabs, Breadcrumb, Steps, Pagination, Menu, ContextMenu",
  },
];

// `--base /soluid` (no trailing slash) is valid on the CLI, so normalize before joining.
const base = import.meta.env.BASE_URL.replace(/\/?$/, "/");

const screenshots = [
  { src: `${base}images/components-wall-dark-4k.png`, altKey: "top.showcaseAltDark" },
  { src: `${base}images/components-wall-light-4k.png`, altKey: "top.showcaseAltLight" },
];

type Screenshot = (typeof screenshots)[number];

/** Full-size viewer: opens the screenshot at 1:1 and scrolls to the spot that was clicked. */
function ScreenshotZoom() {
  const [shown, setShown] = createSignal<Screenshot>();
  // Where the thumbnail was clicked, as a 0..1 ratio of the image.
  let focus = { x: 0.5, y: 0.5 };
  let scroller: HTMLDivElement | undefined;

  function open(shot: Screenshot, event: MouseEvent & { currentTarget: HTMLButtonElement }) {
    const rect = event.currentTarget.getBoundingClientRect();
    focus = {
      x: (event.clientX - rect.left) / rect.width,
      y: (event.clientY - rect.top) / rect.height,
    };
    setShown(shot);
  }

  function scrollToFocus() {
    if (!scroller) return;
    scroller.scrollLeft = focus.x * scroller.scrollWidth - scroller.clientWidth / 2;
    scroller.scrollTop = focus.y * scroller.scrollHeight - scroller.clientHeight / 2;
  }

  // Grab-and-drag panning. Null while no drag is in flight.
  let grab: { x: number; y: number; left: number; top: number } | undefined;

  function startPan(event: PointerEvent & { currentTarget: HTMLDivElement }) {
    // Touch already scrolls natively; only take over for mouse and pen.
    if (event.button !== 0 || event.pointerType === "touch") return;
    const el = event.currentTarget;
    grab = { x: event.clientX, y: event.clientY, left: el.scrollLeft, top: el.scrollTop };
    el.setPointerCapture(event.pointerId);
  }

  function pan(event: PointerEvent & { currentTarget: HTMLDivElement }) {
    if (!grab) return;
    event.currentTarget.scrollLeft = grab.left - (event.clientX - grab.x);
    event.currentTarget.scrollTop = grab.top - (event.clientY - grab.y);
  }

  function endPan(event: PointerEvent & { currentTarget: HTMLDivElement }) {
    if (!grab) return;
    grab = undefined;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  return (
    <>
      <section class="top-showcase">
        <For each={screenshots}>
          {(shot) => (
            <button type="button" class="top-shot" onClick={[open, shot]}>
              <img src={shot.src} alt={t(lang(), shot.altKey)} loading="lazy" />
            </button>
          )}
        </For>
      </section>

      <Show when={shown()}>
        {(shot) => (
          <Dialog open onClose={() => setShown(undefined)} class="top-zoom">
            <DialogHeader class="top-zoom-header">
              <span>{t(lang(), shot().altKey)}</span>
              <IconButton
                size="sm"
                aria-label={t(lang(), "action.close")}
                icon={<span>✕</span>}
                onClick={() => setShown(undefined)}
              />
            </DialogHeader>
            <DialogBody class="top-zoom-body">
              <div
                ref={scroller}
                class="top-zoom-scroll"
                onPointerDown={startPan}
                onPointerMove={pan}
                onPointerUp={endPan}
                onPointerCancel={endPan}
              >
                <img src={shot().src} alt={t(lang(), shot().altKey)} draggable={false} onLoad={scrollToFocus} />
              </div>
            </DialogBody>
          </Dialog>
        )}
      </Show>
    </>
  );
}

export function TopPage() {
  return (
    <div class="top-page">
      <section class="top-hero">
        <h1>soluid</h1>
        <p class="top-hero-sub">{t(lang(), "top.heroSub")}</p>
        <pre class="top-install">
          <code>bunx soluid init</code>
        </pre>
        <p class="top-badges">
          <a href="https://www.npmjs.com/package/soluid" target="_blank" rel="noopener noreferrer">
            <img src="https://img.shields.io/npm/v/soluid" alt="npm version" width="80" height="20" />
          </a>
          <a href="https://github.com/misebox/soluid/blob/main/LICENSE" target="_blank" rel="noopener noreferrer">
            <img src="https://img.shields.io/npm/l/soluid" alt="license" width="78" height="20" />
          </a>
          {/* Drawn here rather than fetched from shields.io: components ship as
              GitHub releases, and shields would print the whole
              `components-v0.2.9` tag beside a terse `npm v0.2.6`. */}
          <a
            class="top-badge"
            href="https://github.com/misebox/soluid/releases"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span class="top-badge__label">components</span>
            <span class="top-badge__value">v{componentsVersion()}</span>
          </a>
        </p>
      </section>

      <ScreenshotZoom />

      <section class="top-features">
        <div class="top-feature-grid">
          <div class="top-feature-card">
            <h3>{t(lang(), "top.featureCopyOwn")}</h3>
            <p>{t(lang(), "top.featureCopyOwnDesc")}</p>
          </div>
          <div class="top-feature-card">
            <h3>{t(lang(), "top.featureAccessible")}</h3>
            <p>{t(lang(), "top.featureAccessibleDesc")}</p>
          </div>
          <div class="top-feature-card">
            <h3>{t(lang(), "top.featureThemeable")}</h3>
            <p>{t(lang(), "top.featureThemeableDesc")}</p>
          </div>
        </div>
      </section>

      <section class="top-categories">
        <h2>{t(lang(), "top.componentsHeading")}</h2>
        <div class="top-feature-grid">
          {categories.map((cat) => (
            <A class="top-category-card" href={`/components#category-${cat.slug}`}>
              <h3>{t(lang(), cat.labelKey)}</h3>
              <p>{cat.components}</p>
            </A>
          ))}
        </div>
        <div class="top-links">
          <A href="/getting-started" class="top-link">
            {t(lang(), "nav.gettingStarted")}
          </A>
          <A href="/components" class="top-link">
            {t(lang(), "nav.browseComponents")}
          </A>
          <A href="/samples" class="top-link">
            {t(lang(), "nav.samples")}
          </A>
          <a href="https://github.com/misebox/soluid" target="_blank" rel="noopener noreferrer" class="top-link">
            GitHub
          </a>
        </div>
      </section>
    </div>
  );
}
