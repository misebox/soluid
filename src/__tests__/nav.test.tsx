// @vitest-environment jsdom
import { createSignal } from "solid-js";
import type { JSX } from "solid-js";
import { render } from "solid-js/web";
import { afterEach, expect, it, vi } from "vitest";
import { Carousel } from "../components/ui/soluid/Carousel";
import { Pagination } from "../components/ui/soluid/Pagination";
import { Tab, TabList, TabPanel, Tabs } from "../components/ui/soluid/Tabs";
import { Tree } from "../components/ui/soluid/Tree";
import type { TreeNode } from "../components/ui/soluid/Tree";

// jsdom has neither; the Carousel needs both to mount.
(globalThis as { ResizeObserver?: unknown }).ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};
(window as { matchMedia?: unknown }).matchMedia = () => ({ matches: false });

let dispose: (() => void) | undefined;
let host: HTMLElement | undefined;

afterEach(() => {
  dispose?.();
  host?.remove();
  dispose = undefined;
  host = undefined;
  vi.useRealTimers();
});

function mount(node: () => JSX.Element) {
  host = document.createElement("div");
  document.body.append(host);
  dispose = render(node, host);
  return host;
}

function press(el: Element | null, key: string) {
  const e = new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true });
  el?.dispatchEvent(e);
  return e;
}

function row(root: ParentNode, label: string) {
  return (
    Array.from(root.querySelectorAll<HTMLButtonElement>(".so-tree__row")).find(
      (el) => el.textContent?.trim() === label,
    ) ?? null
  );
}

function slides(n: number) {
  return Array.from({ length: n }, (_, i) => <div>slide {i}</div>);
}

it("Tree keeps focus on the row expanded with ArrowRight", async () => {
  const nodes: TreeNode[] = [
    { id: "a", label: "A", children: [{ id: "a1", label: "A1" }] },
    { id: "b", label: "B" },
  ];
  const [expanded, setExpanded] = createSignal<string[]>([]);
  const root = mount(() => <Tree nodes={nodes} expanded={expanded()} onExpandedChange={setExpanded} />);
  const a = row(root, "A");
  a?.focus();

  press(a, "ArrowRight");
  await Promise.resolve();

  expect(expanded()).toEqual(["a"]);
  expect(document.activeElement).toBe(row(root, "A"));
});

it("Tree ArrowDown steps over a disabled row", () => {
  const nodes: TreeNode[] = [
    { id: "a", label: "A" },
    { id: "b", label: "B", disabled: true },
    { id: "c", label: "C" },
  ];
  const root = mount(() => <Tree nodes={nodes} expanded={[]} onExpandedChange={() => {}} />);
  const a = row(root, "A");
  a?.focus();

  press(a, "ArrowDown");

  expect(document.activeElement).toBe(row(root, "C"));
});

it("Tree End lands on the last enabled row", () => {
  const nodes: TreeNode[] = [
    { id: "a", label: "A" },
    { id: "b", label: "B" },
    { id: "c", label: "C", disabled: true },
  ];
  const root = mount(() => <Tree nodes={nodes} expanded={[]} onExpandedChange={() => {}} />);
  const a = row(root, "A");
  a?.focus();

  press(a, "End");

  expect(document.activeElement).toBe(row(root, "B"));
});

it("Tree keeps focus in its own rows when another tree uses the same ids", () => {
  const nodes: TreeNode[] = [
    { id: "a", label: "A" },
    { id: "b", label: "B" },
  ];
  const root = mount(() => (
    <>
      <Tree nodes={nodes} expanded={[]} onExpandedChange={() => {}} />
      <Tree nodes={nodes} expanded={[]} onExpandedChange={() => {}} />
    </>
  ));
  const second = root.querySelectorAll(".so-tree")[1];
  const a = row(second, "A");
  a?.focus();

  press(a, "ArrowDown");

  expect(second.contains(document.activeElement)).toBe(true);
});

it("Carousel leaves arrow keys to a control inside a slide", () => {
  const [index, setIndex] = createSignal(0);
  const root = mount(() => (
    <Carousel index={index()} onIndexChange={setIndex}>
      <div>
        <input type="text" />
      </div>
      <div>two</div>
    </Carousel>
  ));
  const input = root.querySelector("input");
  input?.focus();

  const e = press(input, "ArrowRight");

  expect(index()).toBe(0);
  expect(e.defaultPrevented).toBe(false);
});

it("Carousel does not revert the index when two moves land inside the sync window", () => {
  vi.useFakeTimers();
  const [index, setIndex] = createSignal(0);
  const root = mount(() => (
    <Carousel index={index()} onIndexChange={setIndex}>
      {slides(4)}
    </Carousel>
  ));
  const viewport = root.querySelector<HTMLElement>(".so-carousel__viewport") as HTMLElement;
  let scrollLeft = 0;
  Object.defineProperty(viewport, "clientWidth", { value: 100, configurable: true });
  Object.defineProperty(viewport, "scrollLeft", {
    get: () => scrollLeft,
    set: (v: number) => (scrollLeft = v),
    configurable: true,
  });
  (viewport as { scrollTo?: unknown }).scrollTo = () => {};

  setIndex(1);
  vi.advanceTimersByTime(300);
  setIndex(2);
  vi.advanceTimersByTime(100);
  // The browser reports a position between slides 1 and 2 while still animating.
  scrollLeft = 120;
  viewport.dispatchEvent(new Event("scroll"));

  expect(index()).toBe(2);
});

it("Carousel moves back from an index past the last slide", () => {
  const onIndexChange = vi.fn();
  const root = mount(() => (
    <Carousel index={5} onIndexChange={onIndexChange}>
      {slides(3)}
    </Carousel>
  ));
  const prev = root.querySelector<HTMLButtonElement>(".so-carousel__nav--prev");

  prev?.click();

  expect(onIndexChange).toHaveBeenCalledWith(2);
});

it("Tabs keeps a reachable tab stop when the selected tab is disabled", () => {
  const root = mount(() => (
    <Tabs value="b" onChange={() => {}}>
      <TabList>
        <Tab value="a">A</Tab>
        <Tab value="b" disabled>
          B
        </Tab>
      </TabList>
      <TabPanel value="a">a</TabPanel>
      <TabPanel value="b">b</TabPanel>
    </Tabs>
  ));

  expect(root.querySelector('[role="tab"][tabindex="0"]:not(:disabled)')).not.toBeNull();
});

it("Tabs keeps a tab stop when the value matches no tab", () => {
  const root = mount(() => (
    <Tabs value="zzz" onChange={() => {}}>
      <TabList>
        <Tab value="a">A</Tab>
        <Tab value="b">B</Tab>
      </TabList>
    </Tabs>
  ));

  expect(root.querySelector('[role="tab"][tabindex="0"]')).not.toBeNull();
});

it("Pagination always renders the current page with a small maxVisible", () => {
  const root = mount(() => <Pagination showPages maxVisible={3} page={2} totalPages={10} onChange={() => {}} />);

  expect(root.querySelector('[aria-current="page"]')).not.toBeNull();
});

it("Pagination never renders two ellipses in a row", () => {
  const root = mount(() => <Pagination showPages maxVisible={2} page={5} totalPages={10} onChange={() => {}} />);
  const texts = Array.from(root.querySelectorAll(".so-pagination__page, .so-pagination__ellipsis")).map(
    (el) => el.textContent?.trim() ?? "",
  );

  expect(texts.some((t, i) => t === "…" && texts[i + 1] === "…")).toBe(false);
});

it("Carousel keeps off-screen slides out of the Tab order", () => {
  const root = mount(() => (
    <Carousel index={1} onIndexChange={() => {}}>
      {slides(3)}
    </Carousel>
  ));
  // jsdom has no `inert` IDL property, so the value Solid assigned is read back directly.
  const inert = Array.from(root.querySelectorAll<HTMLElement & { inert?: boolean }>(".so-carousel__slide")).map(
    (el) => el.inert === true,
  );

  expect(inert).toEqual([true, false, true]);
});
