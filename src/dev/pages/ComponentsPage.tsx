import { useLocation } from "@solidjs/router";
import { createEffect, createMemo, createSignal, For, onCleanup, onMount, Show } from "solid-js";
import { Badge } from "../../components/ui/soluid/Badge";
import { Card, CardBody, CardHeader } from "../../components/ui/soluid/Card";
import { Tab, TabList, TabPanel, Tabs } from "../../components/ui/soluid/Tabs";
import apiData from "../api-data.json";
import { lang } from "../lang";
import { t } from "../locales";
import { CATEGORIES, CODE_EXAMPLES, DEMOS, SUB_COMPONENTS } from "./componentDemos";

/* ---------- CopyableCode ---------- */

function CopyableCode(props: { code: string }) {
  const [copied, setCopied] = createSignal(false);

  function copy() {
    navigator.clipboard.writeText(props.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div class="code-wrapper">
      <pre class="code-block">
        <code>{props.code}</code>
      </pre>
      <button class="copy-btn" onClick={copy}>
        {copied() ? "Copied" : "Copy"}
      </button>
    </div>
  );
}

/* ---------- Types ---------- */

interface PropInfo {
  name: string;
  type: string;
  optional: boolean;
}
interface ComponentApi {
  name: string;
  description: string;
  dependencies: string[];
  props: PropInfo[];
}

const data = apiData as ComponentApi[];

const propsFor = (componentName: string): ComponentApi[] => {
  const subs = SUB_COMPONENTS[componentName] ?? [componentName];
  return subs.map((sub) => data.find((d) => d.name === `${sub}Props`)).filter((d): d is ComponentApi => d != null);
};

/* ---------- All component names ---------- */

const ALL_NAMES = CATEGORIES.flatMap((c) => c.components);

/* ---------- Page ---------- */

export function ComponentsPage() {
  const [filter, setFilter] = createSignal("");
  const [activeId, setActiveId] = createSignal("");

  const filtered = createMemo(() => {
    const q = filter().toLowerCase();
    if (!q) return CATEGORIES;
    return CATEGORIES.map((cat) => ({
      ...cat,
      components: cat.components.filter((c) => c.toLowerCase().includes(q)),
    })).filter((cat) => cat.components.length > 0);
  });

  const filteredNames = createMemo(() => filtered().flatMap((c) => c.components));

  /* IntersectionObserver for active sidebar link */
  let observers: IntersectionObserver[] = [];

  onMount(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id.replace("component-", ""));
          }
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 },
    );
    observers.push(obs);

    for (const name of ALL_NAMES) {
      const el = document.getElementById(`component-${name}`);
      if (el) obs.observe(el);
    }
  });

  onCleanup(() => {
    for (const obs of observers) obs.disconnect();
  });

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Arriving from another page, the router sets the hash through the history
  // API, which does not scroll on its own.
  const location = useLocation();
  createEffect(() => {
    const id = location.hash.slice(1);
    if (!id) return;
    queueMicrotask(() => document.getElementById(id)?.scrollIntoView({ block: "start" }));
  });

  return (
    <div class="components-page">
      {/* Sidebar */}
      <aside class="components-sidebar">
        <div class="sidebar-search">
          <input
            type="text"
            class="sidebar-search-input"
            aria-label={t(lang(), "ui.searchComponents")}
            placeholder={t(lang(), "ui.search")}
            value={filter()}
            onInput={(e) => setFilter(e.currentTarget.value)}
          />
        </div>
        <nav class="sidebar-nav">
          <For each={filtered()}>
            {(cat) => (
              <div class="sidebar-category">
                <a
                  class="sidebar-category-label"
                  href={`#category-${cat.slug}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo(`category-${cat.slug}`);
                  }}
                >
                  {t(lang(), cat.labelKey)}
                </a>
                <For each={cat.components}>
                  {(name) => (
                    <a
                      class={`sidebar-link${activeId() === name ? " sidebar-link--active" : ""}`}
                      href={`#component-${name}`}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollTo(`component-${name}`);
                      }}
                    >
                      {name}
                    </a>
                  )}
                </For>
              </div>
            )}
          </For>
        </nav>
      </aside>

      {/* Content */}
      <div class="components-content">
        {/* Badge index */}
        <div class="components-badges">
          <For each={filteredNames()}>
            {(name) => (
              <a
                class="components-badge-link"
                href={`#component-${name}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo(`component-${name}`);
                }}
              >
                <Badge variant="neutral" size="sm">
                  {name}
                </Badge>
              </a>
            )}
          </For>
        </div>

        {/* Component cards */}
        <For each={filtered()}>
          {(cat) => (
            <section id={`category-${cat.slug}`} class="components-category">
              <h2>
                <a class="heading-anchor" href={`#category-${cat.slug}`}>
                  {t(lang(), cat.labelKey)}
                  <span class="heading-anchor__mark" aria-hidden="true">
                    #
                  </span>
                </a>
              </h2>
              <For each={cat.components}>{(name) => <ComponentCard name={name} />}</For>
            </section>
          )}
        </For>
      </div>
    </div>
  );
}

/* ---------- Component card ---------- */

function ComponentCard(props: { name: string }) {
  const [tab, setTab] = createSignal("demo");
  const apis = createMemo(() => propsFor(props.name));
  const demo = () => DEMOS[props.name];
  const description = () => t(lang(), `desc.${props.name}`);
  const codeExample = () => CODE_EXAMPLES[props.name];

  return (
    <div id={`component-${props.name}`} class="component-card-anchor">
      <Card>
        <CardHeader>
          <div>
            <a class="heading-anchor component-card-name" href={`#component-${props.name}`}>
              {props.name}
              <span class="heading-anchor__mark" aria-hidden="true">
                #
              </span>
            </a>
            <Show when={description()}>{(desc) => <p class="component-card-desc">{desc()}</p>}</Show>
          </div>
        </CardHeader>
        <CardBody>
          <Tabs value={tab()} onChange={setTab}>
            <TabList>
              <Tab value="demo">{t(lang(), "ui.tabDemo")}</Tab>
              <Tab value="code">{t(lang(), "ui.tabCode")}</Tab>
              <Tab value="api">{t(lang(), "ui.tabApi")}</Tab>
            </TabList>
            <TabPanel value="demo">
              <div class="component-demo">
                <Show when={demo()} fallback={<p>{t(lang(), "ui.noDemo")}</p>}>
                  {(fn) => fn()()}
                </Show>
              </div>
            </TabPanel>
            <TabPanel value="code">
              <div class="component-code">
                <Show when={codeExample()} fallback={<p>{t(lang(), "ui.noCode")}</p>}>
                  {(code) => <CopyableCode code={code()} />}
                </Show>
              </div>
            </TabPanel>
            <TabPanel value="api">
              <div class="component-api">
                <Show when={apis().length > 0} fallback={<p>{t(lang(), "ui.noApi")}</p>}>
                  <For each={apis()}>
                    {(comp) => {
                      const name = comp.name.replace(/Props$/, "");
                      return (
                        <div class="api-sub-section">
                          <Show when={apis().length > 1}>
                            <h4 class="api-sub-name">{name}</h4>
                          </Show>
                          <Show when={t(lang(), `apiDesc.${comp.name}`)}>
                            {(desc) => <p class="api-description">{desc()}</p>}
                          </Show>
                          <table class="api-table">
                            <thead>
                              <tr>
                                <th>Prop</th>
                                <th>Type</th>
                                <th>Required</th>
                                <th>Description</th>
                              </tr>
                            </thead>
                            <tbody>
                              <For each={comp.props}>
                                {(prop) => (
                                  <tr>
                                    <td>
                                      <code>{prop.name}</code>
                                    </td>
                                    <td>
                                      <code>{prop.type}</code>
                                    </td>
                                    <td>{prop.optional ? "" : "Yes"}</td>
                                    <td class="api-table-desc">{(() => t(lang(), `${comp.name}.${prop.name}`))()}</td>
                                  </tr>
                                )}
                              </For>
                            </tbody>
                          </table>
                        </div>
                      );
                    }}
                  </For>
                </Show>
              </div>
            </TabPanel>
          </Tabs>
        </CardBody>
      </Card>
    </div>
  );
}
