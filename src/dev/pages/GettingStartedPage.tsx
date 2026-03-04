import { createSignal } from "solid-js";
import type { JSX } from "solid-js";
import { Stack } from "../../components/ui/soluid/Stack";
import { HStack } from "../../components/ui/soluid/HStack";
import { Card, CardBody, CardHeader } from "../../components/ui/soluid/Card";
import { RadioGroup } from "../../components/ui/soluid/RadioGroup";
import { RadioButton } from "../../components/ui/soluid/RadioButton";

type Runner = "bunx" | "npx";

function CodeBlock(props: { children: string }) {
  return (
    <pre class="gs-code"><code>{props.children}</code></pre>
  );
}

function Step(props: { title: string; children: JSX.Element }) {
  return (
    <Card>
      <CardHeader>{props.title}</CardHeader>
      <CardBody>{props.children}</CardBody>
    </Card>
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
        <h1>Getting Started</h1>
        <RadioGroup value={runner()} onChange={(v) => setRunner(v as Runner)}>
          <HStack gap={3}>
            <RadioButton value="bunx" label="bunx" />
            <RadioButton value="npx" label="npx" />
          </HStack>
        </RadioGroup>
      </HStack>

      <Stack gap={4}>
        <Step title="1. Initialize">
          <p>Run the init command to create a config file in your SolidJS project:</p>
          <CodeBlock>{cmd("init")}</CodeBlock>
          <p>
            This creates <code>soluid.config.json</code> interactively.
          </p>
        </Step>

        <Step title="2. Edit Config">
          <p>Open <code>soluid.config.json</code> and adjust paths and components as needed:</p>
          <CodeBlock>{CONFIG_EXAMPLE}</CodeBlock>
          <ul class="gs-list">
            <li><code>componentDir</code> — directory where component files are copied</li>
            <li><code>cssPath</code> — output path for the concatenated CSS file</li>
            <li><code>components</code> — list of components to install</li>
          </ul>
          <p>
            You can also add or remove components via CLI:
          </p>
          <CodeBlock>{`${cmd("add Checkbox Switch Tabs")}
${cmd("remove Switch")}`}</CodeBlock>
        </Step>

        <Step title="3. Install">
          <p>Download component source files and generate CSS:</p>
          <CodeBlock>{cmd("install")}</CodeBlock>
          <p>
            Components are copied to your project directory.
            All CSS is concatenated into a single file at <code>cssPath</code>.
          </p>
        </Step>

        <Step title="4. Import CSS">
          <p>Add the CSS import to your app entry point:</p>
          <CodeBlock>{`// src/index.tsx
import "./styles/soluid.css";`}</CodeBlock>
        </Step>

        <Step title="5. Use Components">
          <p>Import and use directly — you own the code:</p>
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

        <Step title="Theming">
          <p>Switch between light/dark themes and density variants via data attributes:</p>
          <CodeBlock>{`document.documentElement.setAttribute("data-theme", "dark");
document.documentElement.setAttribute("data-density", "dense");`}</CodeBlock>
        </Step>

        <Step title="Other Commands">
          <CodeBlock>{`${cmd("list")}                # list available components
${cmd("add <component...>")}  # add components to config
${cmd("remove <comp...>")}    # remove from config
${cmd("install")}             # re-download and rebuild CSS`}</CodeBlock>
        </Step>
      </Stack>
    </div>
  );
}
