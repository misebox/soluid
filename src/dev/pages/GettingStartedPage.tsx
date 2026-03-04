import { Stack } from "../../components/ui/soluid/Stack";
import { Card, CardBody, CardHeader } from "../../components/ui/soluid/Card";

function CodeBlock(props: { children: string }) {
  return (
    <pre class="gs-code"><code>{props.children}</code></pre>
  );
}

function Step(props: { title: string; children: any }) {
  return (
    <Card>
      <CardHeader>{props.title}</CardHeader>
      <CardBody>{props.children}</CardBody>
    </Card>
  );
}

export function GettingStartedPage() {
  return (
    <div class="gs-page">
      <h1>Getting Started</h1>

      <Stack gap={4}>
        <Step title="1. Initialize">
          <p>Run the init command to create a config file in your SolidJS project:</p>
          <CodeBlock>bunx soluid init    # or: npx soluid init</CodeBlock>
          <p>
            This creates <code>soluid.config.json</code> where you choose
            the component directory and CSS output path.
          </p>
        </Step>

        <Step title="2. Add Components">
          <p>Add the components you need:</p>
          <CodeBlock>bunx soluid add Button TextField Dialog</CodeBlock>
          <p>
            Components and their dependencies are registered in the config.
          </p>
        </Step>

        <Step title="3. Install">
          <p>Download component source files and generate CSS:</p>
          <CodeBlock>bunx soluid install</CodeBlock>
          <p>
            Components are copied to your project directory.
            All CSS is concatenated into a single file.
          </p>
        </Step>

        <Step title="4. Import CSS">
          <p>Add the CSS import to your app entry point:</p>
          <CodeBlock>{`// src/index.tsx
import "./styles/soluid.css";`}</CodeBlock>
        </Step>

        <Step title="5. Use Components">
          <p>Import and use directly — you own the code:</p>
          <CodeBlock>{`import { Button } from "./components/ui/soluid/Button";
import { TextField } from "./components/ui/soluid/TextField";

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
          <CodeBlock>{`bunx soluid list                # list available components
bunx soluid add <component...>  # add components to config
bunx soluid remove <comp...>    # remove components from config
bunx soluid install             # re-download and rebuild CSS`}</CodeBlock>
        </Step>
      </Stack>
    </div>
  );
}
