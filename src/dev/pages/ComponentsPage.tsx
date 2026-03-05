import { createMemo, createSignal, For, onCleanup, onMount, Show } from "solid-js";
import apiData from "../api-data.json";
import { Badge } from "../../components/ui/soluid/Badge";
import { Card, CardBody, CardHeader } from "../../components/ui/soluid/Card";
import { Tab, TabList, TabPanel, Tabs } from "../../components/ui/soluid/Tabs";
import { CATEGORIES, CODE_EXAMPLES, DEMOS, DESCRIPTIONS, SUB_COMPONENTS } from "./componentDemos";

/* ---------- Types ---------- */

interface PropInfo { name: string; type: string; optional: boolean }
interface ComponentApi { name: string; description: string; dependencies: string[]; props: PropInfo[] }

const data = apiData as ComponentApi[];

const propsFor = (componentName: string): ComponentApi[] => {
  const subs = SUB_COMPONENTS[componentName] ?? [componentName];
  return subs
    .map((sub) => data.find((d) => d.name === `${sub}Props`))
    .filter((d): d is ComponentApi => d != null);
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
    return CATEGORIES
      .map((cat) => ({
        ...cat,
        components: cat.components.filter((c) => c.toLowerCase().includes(q)),
      }))
      .filter((cat) => cat.components.length > 0);
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

  const scrollTo = (name: string) => {
    const el = document.getElementById(`component-${name}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div class="components-page">
      {/* Sidebar */}
      <aside class="components-sidebar">
        <div class="sidebar-search">
          <input
            type="text"
            class="sidebar-search-input"
            placeholder="Search..."
            value={filter()}
            onInput={(e) => setFilter(e.currentTarget.value)}
          />
        </div>
        <nav class="sidebar-nav">
          <For each={filtered()}>
            {(cat) => (
              <div class="sidebar-category">
                <div class="sidebar-category-label">{cat.label}</div>
                <For each={cat.components}>
                  {(name) => (
                    <a
                      class={`sidebar-link${activeId() === name ? " sidebar-link--active" : ""}`}
                      href={`#component-${name}`}
                      onClick={(e) => { e.preventDefault(); scrollTo(name); }}
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
                onClick={(e) => { e.preventDefault(); scrollTo(name); }}
              >
                <Badge variant="neutral" size="sm">{name}</Badge>
              </a>
            )}
          </For>
        </div>

        {/* Component cards */}
        <For each={filtered()}>
          {(cat) => (
            <section class="components-category">
              <h2>{cat.label}</h2>
              <For each={cat.components}>
                {(name) => (
                  <ComponentCard name={name} />
                )}
              </For>
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
  const description = () => DESCRIPTIONS[props.name];
  const codeExample = () => CODE_EXAMPLES[props.name];

  return (
    <div id={`component-${props.name}`} class="component-card-anchor">
      <Card>
        <CardHeader>
          <div>
            <span class="component-card-name">{props.name}</span>
            <Show when={description()}>
              {(desc) => <p class="component-card-desc">{desc()}</p>}
            </Show>
          </div>
        </CardHeader>
        <CardBody>
          <Tabs value={tab()} onChange={setTab}>
            <TabList>
              <Tab value="demo">Demo</Tab>
              <Tab value="code">Code</Tab>
              <Tab value="api">API</Tab>
            </TabList>
            <TabPanel value="demo">
              <div class="component-demo">
                <Show when={demo()} fallback={<p>No demo available.</p>}>
                  {(fn) => fn()()}
                </Show>
              </div>
            </TabPanel>
            <TabPanel value="code">
              <div class="component-code">
                <Show when={codeExample()} fallback={<p>No code example.</p>}>
                  {(code) => <pre class="code-block"><code>{code()}</code></pre>}
                </Show>
              </div>
            </TabPanel>
            <TabPanel value="api">
              <div class="component-api">
                <Show when={apis().length > 0} fallback={<p>No API data.</p>}>
                  <For each={apis()}>
                    {(comp) => {
                      const name = comp.name.replace(/Props$/, "");
                      return (
                        <div class="api-sub-section">
                          <Show when={apis().length > 1}>
                            <h4 class="api-sub-name">{name}</h4>
                          </Show>
                          <Show when={comp.description}>
                            <p class="api-description">{comp.description}</p>
                          </Show>
                          <table class="api-table">
                            <thead>
                              <tr>
                                <th>Prop</th>
                                <th>Type</th>
                                <th>Required</th>
                              </tr>
                            </thead>
                            <tbody>
                              <For each={comp.props}>
                                {(prop) => (
                                  <tr>
                                    <td><code>{prop.name}</code></td>
                                    <td><code>{prop.type}</code></td>
                                    <td>{prop.optional ? "" : "Yes"}</td>
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
