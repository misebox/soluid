import { createSignal } from "solid-js";
import type { JSX } from "solid-js";
import { Stack } from "../../components/ui/soluid/Stack";
import { HStack } from "../../components/ui/soluid/HStack";
import { Card, CardBody, CardHeader } from "../../components/ui/soluid/Card";
import { RadioGroup } from "../../components/ui/soluid/RadioGroup";
import { RadioButton } from "../../components/ui/soluid/RadioButton";
import { lang } from "../lang";
import { t } from "../locales";

type Runner = "bunx" | "npx";

function CodeBlock(props: { children: string }) {
  return (
    <pre class="gs-code"><code>{props.children}</code></pre>
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
        return <>{parts[0]}<code>{props.code}</code>{parts[1]}</>;
      })()}
    </p>
  );
}

const CONFIG_EXAMPLE = `{
  "componentDir": "src/components/ui",
  "cssPath": "src/styles/soluid.css",
  "components": ["Button", "TextField", "Dialog"]
}`;

export function GettingStartedPage() {
  const [runner, setRunner] = createSignal<Runner>("bunx");

  const cmd = (args: string) => `${runner()} soluid ${args}`;

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
          <CodeBlock>{CONFIG_EXAMPLE}</CodeBlock>
          <ul class="gs-list">
            <li><code>componentDir</code> — {t(lang(), "gs.step2.componentDir")}</li>
            <li><code>cssPath</code> — {t(lang(), "gs.step2.cssPath")}</li>
            <li><code>components</code> — {t(lang(), "gs.step2.components")}</li>
          </ul>
          <p>{t(lang(), "gs.step2.p2")}</p>
          <CodeBlock>{`${cmd("add Checkbox Switch Tabs")}
${cmd("remove Switch")}`}</CodeBlock>
        </Step>

        <Step titleKey="gs.step3.title">
          <p>{t(lang(), "gs.step3.p1")}</p>
          <CodeBlock>{cmd("install")}</CodeBlock>
          <TextWithCode textKey="gs.step3.p2" code="cssPath" />
        </Step>

        <Step titleKey="gs.step4.title">
          <p>{t(lang(), "gs.step4.p1")}</p>
          <CodeBlock>{`// src/index.tsx
import "./styles/soluid.css";`}</CodeBlock>
        </Step>

        <Step titleKey="gs.step5.title">
          <p>{t(lang(), "gs.step5.p1")}</p>
          <CodeBlock>{`import { Button, TextField } from "./components/ui";

function App() {
  return (
    <div>
      <TextField label="Name" placeholder="Enter your name" />
      <Button variant="primary">Submit</Button>
    </div>
  );
}`}</CodeBlock>
        </Step>

        <Step titleKey="gs.theme.title">
          <p>{t(lang(), "gs.theme.p1")}</p>
          <CodeBlock>{`document.documentElement.setAttribute("data-theme", "dark");
document.documentElement.setAttribute("data-density", "dense");`}</CodeBlock>
        </Step>

        <Step titleKey="gs.other.title">
          <CodeBlock>{`${cmd("list")}                # list available components
${cmd("add <component...>")}  # add components to config
${cmd("remove <comp...>")}    # remove from config
${cmd("install")}             # re-download and rebuild CSS`}</CodeBlock>
        </Step>
      </Stack>
    </div>
  );
}
