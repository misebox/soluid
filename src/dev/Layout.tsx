import { createEffect, createSignal, type ParentProps } from "solid-js";
import { A } from "@solidjs/router";
import type { Density } from "../components/ui/soluid/core/types";
import { Button } from "../components/ui/soluid/Button";
import { Spacer } from "../components/ui/soluid/Spacer";
import { type Lang, lang, setLang } from "./lang";
import { t } from "./locales";

export function Layout(props: ParentProps) {
  const [density, setDensity] = createSignal<Density>("normal");
  const [theme, setTheme] = createSignal<"light" | "dark">("light");

  createEffect(() => {
    document.documentElement.setAttribute("data-theme", theme());
    document.documentElement.setAttribute("data-density", density());
    document.documentElement.setAttribute("lang", lang());
  });

  return (
    <div class="site">
      <header class="site-header">
        <A href="/" class="site-logo">soluid</A>
        <nav class="site-nav">
          <A href="/getting-started" class="site-nav-link" activeClass="active">{t(lang(), "nav.gettingStarted")}</A>
          <A href="/components" class="site-nav-link" activeClass="active">{t(lang(), "nav.components")}</A>
        </nav>
        <Spacer />
        <div class="site-controls">
          <Button
            variant={density() === "normal" ? "primary" : "neutral"}
            size="sm"
            onClick={() => setDensity("normal")}
          >
            Normal
          </Button>
          <Button
            variant={density() === "dense" ? "primary" : "neutral"}
            size="sm"
            onClick={() => setDensity("dense")}
          >
            Dense
          </Button>
          <select
            class="lang-select"
            value={lang()}
            onChange={(e) => setLang(e.currentTarget.value as Lang)}
          >
            <option value="en">EN</option>
            <option value="ja">JA</option>
          </select>
          <Button
            variant={theme() === "light" ? "primary" : "neutral"}
            size="sm"
            onClick={() => setTheme("light")}
          >
            Light
          </Button>
          <Button
            variant={theme() === "dark" ? "primary" : "neutral"}
            size="sm"
            onClick={() => setTheme("dark")}
          >
            Dark
          </Button>
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
      <main class="site-main">
        {props.children}
      </main>
    </div>
  );
}
