import { createEffect, createSignal, type ParentProps } from "solid-js";
import { A } from "@solidjs/router";
import type { Density } from "../components/ui/soluid/core/types";
import { Button } from "../components/ui/soluid/Button";
import { Spacer } from "../components/ui/soluid/Spacer";

export function Layout(props: ParentProps) {
  const [density, setDensity] = createSignal<Density>("normal");
  const [theme, setTheme] = createSignal<"light" | "dark">("light");

  createEffect(() => {
    document.documentElement.setAttribute("data-theme", theme());
    document.documentElement.setAttribute("data-density", density());
  });

  return (
    <div class="site">
      <header class="site-header">
        <A href="/" class="site-logo">soluid</A>
        <nav class="site-nav">
          <A href="/getting-started" class="site-nav-link" activeClass="active">Getting Started</A>
          <A href="/catalog" class="site-nav-link" activeClass="active">Catalog</A>
          <A href="/api" class="site-nav-link" activeClass="active">API</A>
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
        </div>
      </header>
      <main class="site-main">
        {props.children}
      </main>
    </div>
  );
}
