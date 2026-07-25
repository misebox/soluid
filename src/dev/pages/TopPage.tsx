import { A } from "@solidjs/router";
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

export function TopPage() {
  return (
    <div class="top-page">
      <section class="top-hero">
        <h1>soluid</h1>
        <p class="top-hero-sub">{t(lang(), "top.heroSub")}</p>
        <pre class="top-install">
          <code>bunx soluid init</code>
        </pre>
      </section>

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
            <div class="top-category-card">
              <h3>
                <A class="top-category-link" href={`/components#category-${cat.slug}`}>
                  {t(lang(), cat.labelKey)}
                </A>
              </h3>
              <p>{cat.components}</p>
            </div>
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
