import { A } from "@solidjs/router";

const categories = [
  { name: "Layout", components: "Stack, HStack, Divider, Spacer" },
  { name: "General", components: "Button, IconButton, Badge, Tag, Tooltip, Avatar" },
  { name: "Form", components: "TextField, TextArea, NumberInput, Select, Checkbox, RadioGroup, Switch" },
  { name: "Data Display", components: "Table, Card, DescriptionList, Skeleton, EmptyState, Accordion" },
  { name: "Feedback", components: "Dialog, Drawer, Alert, Toast, Progress, Spinner" },
  { name: "Navigation", components: "Tabs, Breadcrumb, Pagination, Menu" },
];

export function TopPage() {
  return (
    <div class="top-page">
      <section class="top-hero">
        <h1>soluid</h1>
        <p class="top-hero-sub">
          SolidJS Opinionated UI — copy-paste component toolkit for business apps.
        </p>
        <pre class="top-install">
          <code>bunx soluid init</code>
        </pre>
      </section>

      <section class="top-features">
        <div class="top-feature-grid">
          <div class="top-feature-card">
            <h3>Copy & Own</h3>
            <p>Components are copied into your project. No runtime dependency — you own the code.</p>
          </div>
          <div class="top-feature-card">
            <h3>Accessible</h3>
            <p>ARIA attributes, focus traps, keyboard navigation built-in.</p>
          </div>
          <div class="top-feature-card">
            <h3>Themeable</h3>
            <p>CSS custom properties with light/dark themes and density variants.</p>
          </div>
        </div>
      </section>

      <section class="top-categories">
        <h2>Components</h2>
        <div class="top-feature-grid">
          {categories.map((cat) => (
            <div class="top-category-card">
              <h3>{cat.name}</h3>
              <p>{cat.components}</p>
            </div>
          ))}
        </div>
        <div class="top-links">
          <A href="/getting-started" class="top-link">Getting Started</A>
          <A href="/catalog" class="top-link">Browse Catalog</A>
          <A href="/api" class="top-link">API Reference</A>
        </div>
      </section>
    </div>
  );
}
