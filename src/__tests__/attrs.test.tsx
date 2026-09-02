// @vitest-environment jsdom
import type { JSX } from "solid-js";
import { render } from "solid-js/web";
import { afterEach, expect, it, vi } from "vitest";
import { Alert } from "../components/ui/soluid/Alert";
import { Avatar } from "../components/ui/soluid/Avatar";
import { Checkbox } from "../components/ui/soluid/Checkbox";
import { CheckboxGroup } from "../components/ui/soluid/CheckboxGroup";
import { FormField } from "../components/ui/soluid/FormField";
import { MenuItem } from "../components/ui/soluid/Menu";
import { Pagination } from "../components/ui/soluid/Pagination";
import { Progress } from "../components/ui/soluid/Progress";
import { Skeleton } from "../components/ui/soluid/Skeleton";
import { Spinner } from "../components/ui/soluid/Spinner";
import { Tab, TabList, Tabs } from "../components/ui/soluid/Tabs";

let dispose: (() => void) | undefined;
let host: HTMLElement | undefined;

afterEach(() => {
  dispose?.();
  host?.remove();
  dispose = undefined;
  host = undefined;
});

function mount(node: () => JSX.Element) {
  host = document.createElement("div");
  document.body.append(host);
  dispose = render(node, host);
  return host;
}

function q<T extends HTMLElement>(selector: string): T {
  const el = host?.querySelector<T>(selector);
  if (!el) throw new Error(`missing ${selector}`);
  return el;
}

// Each entry mounts a component with attributes its props type does not
// declare; they must all land on the root element.
const roots: Record<string, () => JSX.Element> = {
  Alert: () => (
    <Alert id="root" data-x="1">
      a
    </Alert>
  ),
  Avatar: () => <Avatar name="Jane Doe" id="root" data-x="1" />,
  Pagination: () => <Pagination page={1} totalPages={3} onChange={() => {}} id="root" data-x="1" />,
  Progress: () => <Progress value={40} aria-label="p" id="root" data-x="1" />,
  Tabs: () => (
    <Tabs value="a" onChange={() => {}} id="root" data-x="1">
      <TabList>
        <Tab value="a">A</Tab>
      </TabList>
    </Tabs>
  ),
  MenuItem: () => (
    <MenuItem id="root" data-x="1">
      m
    </MenuItem>
  ),
  CheckboxGroup: () => (
    <CheckboxGroup id="root" data-x="1">
      <Checkbox value="a" label="A" />
    </CheckboxGroup>
  ),
  Skeleton: () => <Skeleton id="root" data-x="1" />,
  Spinner: () => <Spinner id="root" data-x="1" />,
};

for (const [name, node] of Object.entries(roots)) {
  it(`${name} forwards id and data-* to its root`, () => {
    const root = mount(node).firstElementChild;

    expect(root?.id).toBe("root");
    expect(root?.getAttribute("data-x")).toBe("1");
  });
}

it("Alert keeps its own role and class alongside the caller's", () => {
  const root = mount(() => (
    <Alert class="extra" data-x="1">
      a
    </Alert>
  )).firstElementChild;

  expect(root?.getAttribute("role")).toBe("alert");
  expect(root?.classList.contains("so-alert")).toBe(true);
  expect(root?.classList.contains("extra")).toBe(true);
});

it("Avatar and Spinner fire a caller onClick from the root", () => {
  const onAvatar = vi.fn();
  const onSpinner = vi.fn();
  mount(() => (
    <>
      <Avatar name="Jane Doe" onClick={onAvatar} />
      <Spinner onClick={onSpinner} />
    </>
  ));

  q(".so-avatar").click();
  q(".so-spinner").click();
  expect(onAvatar).toHaveBeenCalledTimes(1);
  expect(onSpinner).toHaveBeenCalledTimes(1);
});

it("Tab forwards data-* and title to the button and still selects on click", () => {
  const onChange = vi.fn();
  mount(() => (
    <Tabs value="a" onChange={onChange}>
      <TabList id="list" data-x="1">
        <Tab value="a">A</Tab>
        <Tab value="b" data-x="2" title="second">
          B
        </Tab>
      </TabList>
    </Tabs>
  ));

  const list = q<HTMLElement>('[role="tablist"]');
  expect(list.id).toBe("list");
  expect(list.getAttribute("data-x")).toBe("1");

  const second = q<HTMLButtonElement>('[role="tab"]:nth-child(2)');
  expect(second.getAttribute("data-x")).toBe("2");
  expect(second.title).toBe("second");
  second.click();
  expect(onChange).toHaveBeenCalledWith("b");
});

it("MenuItem keeps onSelect working when attributes are spread", () => {
  const onSelect = vi.fn();
  mount(() => (
    <MenuItem data-x="1" onSelect={onSelect}>
      m
    </MenuItem>
  ));

  q('[role="menuitem"]').click();
  expect(onSelect).toHaveBeenCalledTimes(1);
});

it("FormField sends id to the control and everything else to the wrapper", () => {
  const onClick = vi.fn();
  const root = mount(() => (
    <FormField label="Name" id="ctl" data-x="1" onClick={onClick}>
      <input />
    </FormField>
  )).firstElementChild as HTMLElement;

  expect(root.id).toBe("");
  expect(root.getAttribute("data-x")).toBe("1");
  expect(q<HTMLLabelElement>("label").htmlFor).toBe("ctl");
  root.click();
  expect(onClick).toHaveBeenCalledTimes(1);
});

it("CheckboxGroup passes native fieldset attributes through", () => {
  const root = mount(() => (
    <CheckboxGroup name="tags" disabled>
      <Checkbox value="a" label="A" />
    </CheckboxGroup>
  )).firstElementChild as HTMLFieldSetElement;

  expect(root.tagName).toBe("FIELDSET");
  expect(root.name).toBe("tags");
  expect(root.disabled).toBe(true);
  expect(root.getAttribute("role")).toBe("group");
});

it("Skeleton keeps its sizing when the caller spreads attributes", () => {
  const root = mount(() => <Skeleton width="10px" height="4px" data-x="1" />).firstElementChild as HTMLElement;

  expect(root.style.width).toBe("10px");
  expect(root.style.height).toBe("4px");
  expect(root.getAttribute("aria-hidden")).toBe("true");
});

// The props types are the public API, so the omitted attributes are pinned at
// compile time. A `@ts-expect-error` that stops erroring fails `tsc`.
function typeChecks() {
  // @ts-expect-error the alert role is the component's own
  <Alert role="status">a</Alert>;
  // @ts-expect-error selecting the tab is the Tab's own click
  <Tab value="a" onClick={() => {}}>
    A
  </Tab>;
  // @ts-expect-error the sizing style is set after the spread
  <Skeleton style={{ width: "1px" }} />;
  // @ts-expect-error the progressbar role is the component's own
  <Progress aria-label="p" role="meter" />;
  // @ts-expect-error the roving tabindex is the item's own
  <MenuItem tabIndex={0}>m</MenuItem>;
  // @ts-expect-error the page callback replaces the DOM change event
  <Pagination page={1} totalPages={2} onChange={(e: Event) => e} />;
  <Spinner id="s" data-x="1" title="Loading" />;
  <FormField label="l" id="ctl" data-x="1">
    <input />
  </FormField>;
}
void typeChecks;
