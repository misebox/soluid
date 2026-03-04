import { createMemo, createSignal, For, Show } from "solid-js";
import apiData from "../api-data.json";
import { Card, CardBody, CardHeader } from "../../components/ui/soluid/Card";
import { Badge } from "../../components/ui/soluid/Badge";
import { HStack } from "../../components/ui/soluid/HStack";

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

const componentName = (propsName: string) => propsName.replace(/Props$/, "");

const allNames = data.map((c) => componentName(c.name));

export function ApiPage() {
  const [filter, setFilter] = createSignal("");

  const filtered = createMemo(() => {
    const q = filter().toLowerCase();
    if (!q) return data;
    return data.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q),
    );
  });

  return (
    <div class="api-page">
      <div class="api-header">
        <div class="api-index">
          <For each={allNames}>
            {(name) => (
              <a href={`#${name}`} class="api-index-badge">
                <Badge variant="neutral" size="sm">{name}</Badge>
              </a>
            )}
          </For>
        </div>
        <div class="api-search">
          <svg class="api-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            class="api-search-input"
            placeholder="Search components..."
            value={filter()}
            onInput={(e) => setFilter(e.currentTarget.value)}
          />
        </div>
      </div>
      <p class="api-count">{filtered().length} of {data.length} components</p>
      <div class="api-list">
        <For each={filtered()}>
          {(comp) => {
            const name = componentName(comp.name);
            return (
              <div id={name}>
              <Card class="api-card">
                <CardHeader>
                  <HStack gap={2}>
                    <span class="api-component-name">{name}</span>
                    <Show when={comp.dependencies.length > 0}>
                      <For each={comp.dependencies}>
                        {(dep) => <Badge variant="neutral" size="sm">{dep}</Badge>}
                      </For>
                    </Show>
                  </HStack>
                </CardHeader>
                <CardBody>
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
                </CardBody>
              </Card>
              </div>
            );
          }}
        </For>
      </div>
    </div>
  );
}
