import { A } from "@solidjs/router";
import { lang } from "../lang";
import { t } from "../locales";

const categories = [
  { labelKey: "cat.layout", components: "Stack, HStack, Divider, Spacer" },
  { labelKey: "cat.general", components: "Button, IconButton, Badge, Tag, Tooltip, Avatar" },
  { labelKey: "cat.form", components: "TextField, TextArea, NumberInput, Select, Checkbox, RadioGroup, Switch" },
  { labelKey: "cat.data", components: "Table, Card, DescriptionList, Skeleton, EmptyState, Accordion" },
  { labelKey: "cat.feedback", components: "Dialog, Drawer, Alert, Toast, Progress, Spinner" },
  { labelKey: "cat.navigation", components: "Tabs, Breadcrumb, Pagination, Menu" },
];

export function TopPage() {
  return (
    <div class="top-page">
      <section class="top-hero">
        <h1>soluid</h1>
        <p class="top-hero-sub">
          {t(lang(), "top.heroSub")}
        </p>
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
              <h3>{t(lang(), cat.labelKey)}</h3>
              <p>{cat.components}</p>
            </div>
          ))}
        </div>
        <div class="top-links">
          <A href="/getting-started" class="top-link">{t(lang(), "nav.gettingStarted")}</A>
          <A href="/components" class="top-link">{t(lang(), "nav.browseComponents")}</A>
          <a href="https://github.com/misebox/soluid" target="_blank" rel="noopener noreferrer" class="top-link">GitHub</a>
        </div>
      </section>
    </div>
  );
}
