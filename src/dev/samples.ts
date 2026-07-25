/**
 * The sample apps under src/samples/ are standalone Vite builds, deliberately
 * kept outside this catalog SPA so they stay real, runnable applications.
 * That means they are linked with plain anchors, not the router's <A>.
 */

export interface SampleApp {
  slug: string;
  titleKey: string;
  descriptionKey: string;
}

export const SAMPLES: SampleApp[] = [
  { slug: "dashboard", titleKey: "sample.dashboard", descriptionKey: "sample.dashboardDesc" },
  { slug: "settings", titleKey: "sample.settings", descriptionKey: "sample.settingsDesc" },
  { slug: "mail", titleKey: "sample.mail", descriptionKey: "sample.mailDesc" },
  { slug: "shop", titleKey: "sample.shop", descriptionKey: "sample.shopDesc" },
];

/**
 * Built output is served from <base>samples/<slug>/. The dev server never
 * builds the samples, so there it has to point at the source entry instead —
 * without this the link silently falls back to the catalog's index.html.
 */
export function sampleHref(slug: string): string {
  const base = import.meta.env.BASE_URL;
  return import.meta.env.DEV ? `${base}src/samples/${slug}/index.html` : `${base}samples/${slug}/`;
}

/** Source of the sample on GitHub, so the markup can be read alongside the demo. */
export function sampleSourceHref(slug: string): string {
  return `https://github.com/misebox/soluid/blob/main/src/samples/${slug}/App.tsx`;
}
