import { A } from "@solidjs/router";
import { createEffect, createSignal, type ParentProps } from "solid-js";
import type { Density } from "../components/ui/soluid/core/types";
import { Button } from "../components/ui/soluid/Button";
import { Dialog, DialogBody, DialogFooter, DialogHeader } from "../components/ui/soluid/Dialog";
import { IconButton } from "../components/ui/soluid/IconButton";
import { Spacer } from "../components/ui/soluid/Spacer";
import { type Lang, lang, setLang } from "./lang";
import { t } from "./locales";
import { SAMPLES, sampleHref, sampleSourceHref } from "./samples";

const SunIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <circle cx="12" cy="12" r="5" />
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
  </svg>
);

const MoonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

/* Rows inside a frame, so the icon reads as row spacing rather than as the
   hamburger menu three bare lines look like. */
const DensityNormalIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
    <rect x="3" y="3" width="18" height="18" rx="2.5" />
    <path d="M7 9.5h10M7 14.5h10" />
  </svg>
);

const DensityDenseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
    <rect x="3" y="3" width="18" height="18" rx="2.5" />
    <path d="M7 8h10M7 12h10M7 16h10" />
  </svg>
);

export function Layout(props: ParentProps) {
  const [density, setDensity] = createSignal<Density>("normal");
  const [theme, setTheme] = createSignal<"light" | "dark">("light");
  const [samplesOpen, setSamplesOpen] = createSignal(false);

  createEffect(() => {
    document.documentElement.setAttribute("data-theme", theme());
    document.documentElement.setAttribute("data-density", density());
    document.documentElement.setAttribute("lang", lang());
  });

  return (
    <div class="site">
      <header class="site-header">
        <A href="/" class="site-logo">
          soluid
        </A>
        <nav class="site-nav">
          <A href="/getting-started" class="site-nav-link" activeClass="active">
            {t(lang(), "nav.gettingStarted")}
          </A>
          <A href="/components" class="site-nav-link" activeClass="active">
            {t(lang(), "nav.components")}
          </A>
          <button type="button" class="site-nav-link" onClick={() => setSamplesOpen(true)}>
            {t(lang(), "nav.samples")}
          </button>
        </nav>
        <Spacer />
        <div class="site-controls">
          <IconButton
            icon={density() === "normal" ? <DensityNormalIcon /> : <DensityDenseIcon />}
            aria-label={density() === "normal" ? "Switch to dense" : "Switch to normal"}
            variant="ghost"
            size="sm"
            onClick={() => setDensity(density() === "normal" ? "dense" : "normal")}
          />
          <select class="lang-select" value={lang()} onChange={(e) => setLang(e.currentTarget.value as Lang)}>
            <option value="en">EN</option>
            <option value="ja">JA</option>
          </select>
          <IconButton
            icon={theme() === "light" ? <SunIcon /> : <MoonIcon />}
            aria-label={theme() === "light" ? "Switch to dark mode" : "Switch to light mode"}
            variant="ghost"
            size="sm"
            onClick={() => setTheme(theme() === "light" ? "dark" : "light")}
          />
          <a
            href="https://github.com/misebox/soluid"
            target="_blank"
            rel="noopener noreferrer"
            class="github-link"
            aria-label="GitHub"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </a>
        </div>
      </header>
      <main class="site-main">{props.children}</main>

      {/* The samples are separate builds, so each entry is a plain anchor that
          leaves the SPA rather than a router link. */}
      <Dialog open={samplesOpen()} onClose={() => setSamplesOpen(false)} size="md">
        <DialogHeader>{t(lang(), "top.samplesHeading")}</DialogHeader>
        <DialogBody>
          <p class="sample-dialog-lead">{t(lang(), "top.samplesLead")}</p>
          <ul class="sample-dialog-list">
            {SAMPLES.map((sample) => (
              <li class="sample-dialog-item">
                <a class="sample-dialog-link" href={sampleHref(sample.slug)}>
                  {t(lang(), sample.titleKey)}
                </a>
                <p class="sample-dialog-desc">{t(lang(), sample.descriptionKey)}</p>
                <a
                  class="sample-dialog-source"
                  href={sampleSourceHref(sample.slug)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t(lang(), "top.samplesSource")}
                </a>
              </li>
            ))}
          </ul>
        </DialogBody>
        <DialogFooter>
          <Button variant="neutral" onClick={() => setSamplesOpen(false)}>
            {t(lang(), "action.close")}
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
