import { A } from "@solidjs/router";
import { createSignal, Show } from "solid-js";
import { Button } from "../../components/ui/soluid/Button";
import { Dialog, DialogBody, DialogFooter, DialogHeader } from "../../components/ui/soluid/Dialog";
import { lang } from "../lang";
import { t } from "../locales";
import { type SampleApp, SAMPLES, sampleHref, sampleSourceHref } from "../samples";

const categories = [
  { labelKey: "cat.layout", components: "Stack, HStack, Divider, Spacer" },
  { labelKey: "cat.general", components: "Button, IconButton, Badge, Tag, Tooltip, Avatar" },
  { labelKey: "cat.form", components: "TextField, TextArea, NumberInput, Select, Checkbox, RadioGroup, Switch" },
  { labelKey: "cat.data", components: "Table, Card, DescriptionList, Skeleton, EmptyState, Accordion" },
  { labelKey: "cat.feedback", components: "Dialog, Drawer, Alert, Toast, Progress, Spinner" },
  { labelKey: "cat.navigation", components: "Tabs, Breadcrumb, Pagination, Menu" },
];

export function TopPage() {
  const [preview, setPreview] = createSignal<SampleApp | null>(null);

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

      <section class="top-samples">
        <h2>{t(lang(), "top.samplesHeading")}</h2>
        <p class="top-samples-lead">{t(lang(), "top.samplesLead")}</p>
        <div class="top-feature-grid">
          {SAMPLES.map((sample) => (
            <div class="top-sample-card">
              <h3>
                <button type="button" class="top-sample-open" onClick={() => setPreview(sample)}>
                  {t(lang(), sample.titleKey)}
                </button>
              </h3>
              <p>{t(lang(), sample.descriptionKey)}</p>
              <div class="top-sample-links">
                <a href={sampleHref(sample.slug)} target="_blank" rel="noopener noreferrer">
                  {t(lang(), "top.samplesNewTab")}
                </a>
                <a href={sampleSourceHref(sample.slug)} target="_blank" rel="noopener noreferrer">
                  {t(lang(), "top.samplesSource")}
                </a>
              </div>
            </div>
          ))}
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
          <A href="/getting-started" class="top-link">
            {t(lang(), "nav.gettingStarted")}
          </A>
          <A href="/components" class="top-link">
            {t(lang(), "nav.browseComponents")}
          </A>
          <a href="https://github.com/misebox/soluid" target="_blank" rel="noopener noreferrer" class="top-link">
            GitHub
          </a>
        </div>
      </section>

      {/* The sample is a separate build, so it runs inside an iframe rather
          than being mounted into this app. */}
      <Dialog open={preview() !== null} onClose={() => setPreview(null)} size="lg" class="sample-preview">
        <Show when={preview()}>
          {(sample) => (
            <>
              <DialogHeader>{t(lang(), sample().titleKey)}</DialogHeader>
              <DialogBody class="sample-preview__body">
                <iframe
                  class="sample-preview__frame"
                  src={sampleHref(sample().slug)}
                  title={t(lang(), sample().titleKey)}
                />
              </DialogBody>
              <DialogFooter>
                <div class="sample-preview__actions">
                  <a href={sampleHref(sample().slug)} target="_blank" rel="noopener noreferrer">
                    {t(lang(), "top.samplesNewTab")}
                  </a>
                  <a href={sampleSourceHref(sample().slug)} target="_blank" rel="noopener noreferrer">
                    {t(lang(), "top.samplesSource")}
                  </a>
                  <Button variant="neutral" onClick={() => setPreview(null)}>
                    {t(lang(), "action.close")}
                  </Button>
                </div>
              </DialogFooter>
            </>
          )}
        </Show>
      </Dialog>
    </div>
  );
}
