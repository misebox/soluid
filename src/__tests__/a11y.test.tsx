// @vitest-environment jsdom
import axe from "axe-core";
import type { JSX } from "solid-js";
import { render } from "solid-js/web";
import { afterEach, expect, it } from "vitest";
import { ColorPicker } from "../components/ui/soluid/ColorPicker";
import { Combobox } from "../components/ui/soluid/Combobox";
import { CommandPalette } from "../components/ui/soluid/CommandPalette";
import { DatePicker } from "../components/ui/soluid/DatePicker";
import { Dialog, DialogBody } from "../components/ui/soluid/Dialog";
import { Popover } from "../components/ui/soluid/Popover";
import { DEMOS } from "../dev/pages/componentDemos";

/**
 * Every catalog demo, checked with axe.
 *
 * The demos double as fixtures so there is only one set of examples to keep
 * current. jsdom has no layout engine and does not apply the component CSS, so
 * only the rules that read the DOM structure can run here — colour contrast and
 * target size need a real browser and are checked separately.
 */
/* jsdom implements neither of these; Carousel uses both. */
if (!globalThis.ResizeObserver) {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {};
}
if (!window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({ matches: false, media: query, addEventListener() {}, removeEventListener() {} }) as unknown as MediaQueryList;
}

const STRUCTURAL_RULES = [
  "aria-allowed-attr",
  "aria-allowed-role",
  "aria-hidden-focus",
  "aria-progressbar-name",
  "aria-required-attr",
  "aria-required-children",
  "aria-required-parent",
  "aria-roles",
  "aria-toggle-field-name",
  "aria-valid-attr",
  "aria-valid-attr-value",
  "button-name",
  "image-alt",
  "input-button-name",
  "label",
  "link-name",
  "role-img-alt",
  "select-name",
];

let dispose: (() => void) | undefined;
let host: HTMLElement | undefined;

afterEach(() => {
  dispose?.();
  host?.remove();
  dispose = undefined;
  host = undefined;
});

for (const [name, Demo] of Object.entries(DEMOS)) {
  it(`${name} has no structural accessibility violations`, async () => {
    host = document.createElement("div");
    document.body.appendChild(host);
    dispose = render(() => <Demo />, host);

    const result = await axe.run(host, { runOnly: STRUCTURAL_RULES });

    const failures = result.violations.map(
      (violation) => `${violation.id}: ${violation.nodes.map((node) => node.html).join(" | ")}`,
    );
    expect(failures).toEqual([]);
  });
}

/**
 * States the catalog demos do not show. The demos above are the happy path;
 * these are the configurations a caller reaches by leaving something out.
 */
function mount(ui: () => JSX.Element) {
  host = document.createElement("div");
  document.body.appendChild(host);
  dispose = render(ui, host);
  return host;
}

async function violationsIn(root: HTMLElement): Promise<string[]> {
  const result = await axe.run(root, { runOnly: STRUCTURAL_RULES });
  return result.violations.map(
    (violation) => `${violation.id}: ${violation.nodes.map((node) => node.html).join(" | ")}`,
  );
}

it("a Dialog without a header is not labelled by an element that does not exist", async () => {
  const root = mount(() => (
    <Dialog open onClose={() => {}}>
      <DialogBody>
        <button>ok</button>
      </DialogBody>
    </Dialog>
  ));

  const labelledBy = document.querySelector('[role="dialog"]')?.getAttribute("aria-labelledby");

  expect(labelledBy == null || document.getElementById(labelledBy) !== null).toBe(true);
  expect(await violationsIn(root)).toEqual([]);
});

it("a Combobox with nothing to show is not an empty listbox", async () => {
  const root = mount(() => <Combobox label="Letter" options={[]} />);
  const input = root.querySelector("input");
  input?.focus();
  input?.click();

  expect(document.querySelector(".so-combobox__list")?.getAttribute("role")).toBe("presentation");
  expect(await violationsIn(root)).toEqual([]);
});

it("a CommandPalette names its search box and its dialog without being told to", async () => {
  const root = mount(() => (
    <CommandPalette open onOpenChange={() => {}} commands={[{ id: "a", label: "Alpha" }]} onSelect={() => {}} />
  ));
  await Promise.resolve();

  expect(document.querySelector(".so-command__input")?.getAttribute("aria-label")).toBe("Search commands");
  expect(document.querySelector(".so-command")?.getAttribute("aria-label")).toBe("Search commands");
  expect(await violationsIn(root)).toEqual([]);
});

it("a required DatePicker or ColorPicker trigger carries aria-required on a role that allows it", async () => {
  const root = mount(() => (
    <>
      <DatePicker label="Delivery" required />
      <ColorPicker label="Brand colour" required />
    </>
  ));

  for (const selector of [".so-date-picker__trigger", ".so-color-picker__trigger"]) {
    expect(root.querySelector(selector)?.getAttribute("aria-required"), selector).toBe("true");
  }
  expect(await violationsIn(root)).toEqual([]);
});

it("a Popover panel can be given a name", async () => {
  const root = mount(() => (
    <Popover open onOpenChange={() => {}} label="Filters" content={<button>inside</button>}>
      Open
    </Popover>
  ));

  expect(document.querySelector(".so-popover")?.getAttribute("aria-label")).toBe("Filters");
  expect(await violationsIn(root)).toEqual([]);
});
