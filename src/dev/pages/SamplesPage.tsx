import { createSignal, Show } from "solid-js";
import { Button } from "../../components/ui/soluid/Button";
import { Dialog, DialogBody, DialogFooter, DialogHeader } from "../../components/ui/soluid/Dialog";
import { lang } from "../lang";
import { t } from "../locales";
import { type SampleApp, SAMPLES, sampleHref, sampleSourceHref } from "../samples";

export function SamplesPage() {
  const [preview, setPreview] = createSignal<SampleApp | null>(null);

  return (
    <div class="samples-page">
      <h1>{t(lang(), "samples.heading")}</h1>
      <p class="samples-lead">{t(lang(), "samples.lead")}</p>

      <div class="samples-grid">
        {SAMPLES.map((sample) => (
          <div class="samples-card">
            <h2>
              <button type="button" class="samples-card-open" onClick={() => setPreview(sample)}>
                {t(lang(), sample.titleKey)}
              </button>
            </h2>
            <p>{t(lang(), sample.descriptionKey)}</p>
            <div class="samples-card-links">
              <a href={sampleHref(sample.slug)} target="_blank" rel="noopener noreferrer">
                {t(lang(), "samples.newTab")}
              </a>
              <a href={sampleSourceHref(sample.slug)} target="_blank" rel="noopener noreferrer">
                {t(lang(), "samples.source")}
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* The sample is a separate build with no navigation back to the catalog,
          so it is shown in a dialog the visitor can simply close. */}
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
                    {t(lang(), "samples.newTab")}
                  </a>
                  <a href={sampleSourceHref(sample().slug)} target="_blank" rel="noopener noreferrer">
                    {t(lang(), "samples.source")}
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
