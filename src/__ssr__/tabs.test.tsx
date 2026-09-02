import { renderToString } from "solid-js/web";
import { isServer } from "solid-js/web";
import { expect, it } from "vitest";
import { Tab, TabList, Tabs } from "../components/ui/soluid/Tabs";

it("runs against the server build", () => {
  expect(isServer).toBe(true);
});

it("the server-rendered tab list carries a tab stop", () => {
  // A memo would be evaluated once, before any Tab has registered, and every
  // tab would ship as tabindex="-1" until hydration finished.
  const html = renderToString(() => (
    <Tabs value="b" onChange={() => {}}>
      <TabList>
        <Tab value="a">A</Tab>
        <Tab value="b">B</Tab>
      </TabList>
    </Tabs>
  ));

  expect(html).toMatch(/tabindex="0"/i);
});
