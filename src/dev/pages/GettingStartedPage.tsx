import { createResource, createSignal } from "solid-js";
import type { JSX } from "solid-js";
import { Card, CardBody, CardHeader } from "../../components/ui/soluid/Card";
import { HStack } from "../../components/ui/soluid/HStack";
import { RadioButton } from "../../components/ui/soluid/RadioButton";
import { RadioGroup } from "../../components/ui/soluid/RadioGroup";
import { Stack } from "../../components/ui/soluid/Stack";
import { lang } from "../lang";
import { t } from "../locales";

type Runner = "bunx" | "npx";

function CodeBlock(props: { children: string }) {
  const [copied, setCopied] = createSignal(false);

  function copy() {
    navigator.clipboard.writeText(props.children);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div class="code-wrapper">
      <pre class="gs-code">
        <code>{props.children}</code>
      </pre>
      <button class="copy-btn" onClick={copy}>
        {copied() ? "Copied" : "Copy"}
      </button>
    </div>
  );
}

function Step(props: { titleKey: string; children: JSX.Element }) {
  return (
    <Card>
      <CardHeader>{t(lang(), props.titleKey)}</CardHeader>
      <CardBody>{props.children}</CardBody>
    </Card>
  );
}

/** Replace `{code}` placeholder with inline <code> element */
function TextWithCode(props: { textKey: string; code: string }) {
  const text = () => t(lang(), props.textKey);
  return (
    <p>
      {(() => {
        const parts = text().split("{code}");
        if (parts.length === 1) return parts[0];
        return (
          <>
            {parts[0]}
            <code>{props.code}</code>
            {parts[1]}
          </>
        );
      })()}
    </p>
  );
}

const COLORS_EXAMPLE = `"colors": {
  "primary": "#7c3aed",
  "danger": "#e11d48"
}`;

/** Shown until the release list loads, and if GitHub is unreachable or rate-limits us. */
const FALLBACK_COMPONENTS_VERSION = "0.2.7";

/** Same lookup the CLI does in cli/config.ts, over plain HTTP so the static site stays current. */
async function fetchLatestComponentsVersion(): Promise<string> {
  try {
    const res = await fetch("https://api.github.com/repos/misebox/soluid/releases?per_page=20");
    if (!res.ok) return FALLBACK_COMPONENTS_VERSION;
    const releases = (await res.json()) as Array<{ tag_name: string }>;
    const latest = releases.find((r) => r.tag_name.startsWith("components-v"));
    return latest ? latest.tag_name.replace("components-v", "") : FALLBACK_COMPONENTS_VERSION;
  } catch {
    return FALLBACK_COMPONENTS_VERSION;
  }
}

export function GettingStartedPage() {
  const [runner, setRunner] = createSignal<Runner>("bunx");
  const [componentsVersion] = createResource(fetchLatestComponentsVersion);

  const cmd = (args: string) => `${runner()} soluid ${args}`;

  const configExample = () => `{
  "componentsVersion": "${componentsVersion() ?? FALLBACK_COMPONENTS_VERSION}",
  "componentDir": "src/components/ui",
  "cssPath": "src/soluid.css",
  "components": ["Button", "TextField", "Dialog"]
}`;

  return (
    <div class="gs-page">
      <HStack gap={4} align="center">
        <h1>{t(lang(), "gs.title")}</h1>
        <RadioGroup value={runner()} onChange={(v) => setRunner(v as Runner)}>
          <HStack gap={3}>
            <RadioButton value="bunx" label="bunx" />
            <RadioButton value="npx" label="npx" />
          </HStack>
        </RadioGroup>
      </HStack>

      <Stack gap={4}>
        <Step titleKey="gs.step1.title">
          <p>{t(lang(), "gs.step1.p1")}</p>
          <CodeBlock>{cmd("init")}</CodeBlock>
          <TextWithCode textKey="gs.step1.p2" code="soluid.config.json" />
        </Step>

        <Step titleKey="gs.step2.title">
          <TextWithCode textKey="gs.step2.p1" code="soluid.config.json" />
          <CodeBlock>{configExample()}</CodeBlock>
          <ul class="gs-list">
            <li>
              <code>componentsVersion</code> — {t(lang(), "gs.step2.componentsVersion")}
            </li>
            <li>
              <code>componentDir</code> — {t(lang(), "gs.step2.componentDir")}
            </li>
            <li>
              <code>cssPath</code> — {t(lang(), "gs.step2.cssPath")}
            </li>
            <li>
              <code>components</code> — {t(lang(), "gs.step2.components")}
            </li>
          </ul>
          <p>{t(lang(), "gs.step2.p2")}</p>
          <CodeBlock>
            {`${cmd("add Checkbox Switch Tabs")}
${cmd("remove Switch")}`}
          </CodeBlock>
        </Step>

        <Step titleKey="gs.step3.title">
          <p>{t(lang(), "gs.step3.p1")}</p>
          <CodeBlock>{cmd("install")}</CodeBlock>
          <TextWithCode textKey="gs.step3.p2" code="cssPath" />
        </Step>

        <Step titleKey="gs.step4.title">
          <p>{t(lang(), "gs.step4.p1")}</p>
          <CodeBlock>
            {`// src/index.tsx
import "./soluid.css";`}
          </CodeBlock>
        </Step>

        <Step titleKey="gs.step5.title">
          <p>{t(lang(), "gs.step5.p1")}</p>
          <CodeBlock>
            {`import { Button, TextField } from "./components/ui";

function App() {
  return (
    <div>
      <TextField label="Name" placeholder="Enter your name" />
      <Button variant="primary">Submit</Button>
    </div>
  );
}`}
          </CodeBlock>
        </Step>

        <Step titleKey="gs.theme.title">
          <p>{t(lang(), "gs.theme.p1")}</p>
          <CodeBlock>
            {`document.documentElement.setAttribute("data-theme", "dark");
document.documentElement.setAttribute("data-density", "dense");`}
          </CodeBlock>
          <p>{t(lang(), "gs.theme.colorsIntro")}</p>
          <CodeBlock>{COLORS_EXAMPLE}</CodeBlock>
          <p>{t(lang(), "gs.theme.colorsNote")}</p>
        </Step>

        <Step titleKey="gs.other.title">
          <CodeBlock>
            {`${cmd("list")}                # list available components
${cmd("add <component...>")}  # add components to config
${cmd("remove <comp...>")}    # remove from config
${cmd("install")}             # re-download and rebuild CSS`}
          </CodeBlock>
        </Step>
      </Stack>
    </div>
  );
}
