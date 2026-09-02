// @vitest-environment jsdom
import { createSignal } from "solid-js";
import type { JSX } from "solid-js";
import { render } from "solid-js/web";
import { afterEach, expect, it, vi } from "vitest";
import { Accordion, AccordionItem } from "../components/ui/soluid/Accordion";
import { Calendar } from "../components/ui/soluid/Calendar";
import { ColorPickerControl } from "../components/ui/soluid/ColorPicker";
import { ComboboxControl } from "../components/ui/soluid/Combobox";
import { CommandPalette } from "../components/ui/soluid/CommandPalette";
import { DatePickerControl } from "../components/ui/soluid/DatePicker";
import { Dialog, DialogBody } from "../components/ui/soluid/Dialog";
import { Menu, MenuItem } from "../components/ui/soluid/Menu";
import { TimePickerControl } from "../components/ui/soluid/TimePicker";
import { Tooltip } from "../components/ui/soluid/Tooltip";
import { Tree } from "../components/ui/soluid/Tree";

if (!Element.prototype.scrollIntoView) Element.prototype.scrollIntoView = () => {};

const cleanups: (() => void)[] = [];

afterEach(() => {
  while (cleanups.length > 0) cleanups.pop()?.();
  document.body.replaceChildren();
  document.documentElement.style.overflow = "";
  document.body.style.overflow = "";
});

function mount(ui: () => JSX.Element): HTMLElement {
  const host = document.createElement("div");
  document.body.append(host);
  const dispose = render(ui, host);
  cleanups.push(() => {
    dispose();
    host.remove();
  });
  return host;
}

function q<T extends HTMLElement>(selector: string): T {
  const el = document.querySelector<T>(selector);
  if (!el) throw new Error(`missing ${selector}`);
  return el;
}

function press(target: EventTarget, key: string, init: KeyboardEventInit = {}) {
  const e = new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true, ...init });
  target.dispatchEvent(e);
  return e;
}

async function settle() {
  await Promise.resolve();
  await Promise.resolve();
}

function placed() {
  return new Promise<void>((resolve) => setTimeout(resolve, 0));
}

const letters = [
  { value: "a", label: "A" },
  { value: "b", label: "B" },
];

it("focus trap counts an Accordion header as a tab stop", async () => {
  mount(() => (
    <Dialog open onClose={() => {}}>
      <DialogBody>
        <button>first</button>
        <Accordion>
          <AccordionItem title="Section">body</AccordionItem>
        </Accordion>
      </DialogBody>
    </Dialog>
  ));
  await settle();
  q<HTMLButtonElement>(".so-dialog button").focus();

  press(document, "Tab", { shiftKey: true });

  expect(document.activeElement?.tagName).toBe("SUMMARY");
});

it("Calendar Home and End move to the ends of the week", async () => {
  const root = mount(() => <Calendar value="2026-05-13" />);
  const day = root.querySelector<HTMLButtonElement>('[data-so-day="2026-05-13"]');
  day?.focus();

  press(day as Element, "Home");
  await Promise.resolve();
  expect(document.activeElement?.getAttribute("data-so-day")).toBe("2026-05-10");

  press(document.activeElement as Element, "End");
  await Promise.resolve();
  expect(document.activeElement?.getAttribute("data-so-day")).toBe("2026-05-16");
});

it("Calendar Shift+PageUp moves a year back", async () => {
  const root = mount(() => <Calendar value="2026-05-15" />);
  const day = root.querySelector<HTMLButtonElement>('[data-so-day="2026-05-15"]');
  day?.focus();

  press(day as Element, "PageUp", { shiftKey: true });
  await Promise.resolve();

  expect(document.activeElement?.getAttribute("data-so-day")).toBe("2025-05-15");
});

it("Calendar keeps the tab stop on the day that was last focused", async () => {
  const root = mount(() => <Calendar value="2026-05-15" />);
  const day = root.querySelector<HTMLButtonElement>('[data-so-day="2026-05-15"]');
  day?.focus();

  press(day as Element, "ArrowRight");
  await Promise.resolve();

  expect(root.querySelector('[data-so-day="2026-05-16"]')?.getAttribute("tabindex")).toBe("0");
  expect(root.querySelector('[data-so-day="2026-05-15"]')?.getAttribute("tabindex")).toBe("-1");
});

it("DatePicker closes on Tab from a day reached with the arrow keys", async () => {
  mount(() => <DatePickerControl value="2026-05-15" />);
  const trigger = q<HTMLButtonElement>(".so-date-picker__trigger");
  trigger.click();
  await settle();
  await settle();
  const day = q<HTMLButtonElement>('[data-so-day="2026-05-15"]');
  day.focus();
  press(day, "ArrowRight");
  await Promise.resolve();

  press(document.activeElement as Element, "Tab");
  await settle();

  expect(trigger.getAttribute("aria-expanded")).toBe("false");
});

it("ColorPicker moves focus into its panel and closes on Tab past the last field", async () => {
  mount(() => <ColorPickerControl value="#ff0000" />);
  const trigger = q<HTMLButtonElement>(".so-color-picker__trigger");
  trigger.focus();
  trigger.click();
  await placed();
  const panel = q(".so-color-picker__panel");
  expect(panel.contains(document.activeElement)).toBe(true);

  q<HTMLInputElement>(".so-color-picker__hex-input").focus();
  press(document.activeElement as Element, "Tab");
  await settle();

  expect(trigger.getAttribute("aria-expanded")).toBe("false");
  expect(document.activeElement).toBe(trigger);
});

it("TimePicker's trigger is a combobox, so aria-activedescendant is allowed on it", () => {
  mount(() => <TimePickerControl value="09:00" />);

  expect(q(".so-time-picker__trigger").getAttribute("role")).toBe("combobox");
});

it("Combobox with no matches does not claim an expanded list", async () => {
  mount(() => <ComboboxControl options={letters} />);
  const input = q<HTMLInputElement>("input");
  input.focus();
  input.click();
  input.value = "zzz";
  input.dispatchEvent(new Event("input", { bubbles: true }));
  await settle();

  expect(document.querySelector(".so-combobox__empty")).not.toBeNull();
  expect(input.getAttribute("aria-expanded")).toBe("false");
  expect(input.getAttribute("aria-activedescendant")).toBeNull();
  expect(document.querySelector('[role="listbox"] > li:not([role="presentation"])')).toBeNull();
});

it("Combobox and CommandPalette ignore the Enter that confirms an IME composition", async () => {
  const onChange = vi.fn();
  const onSelect = vi.fn();
  mount(() => (
    <>
      <ComboboxControl options={letters} onChange={onChange} />
      <CommandPalette open onOpenChange={() => {}} commands={[{ id: "a", label: "Alpha" }]} onSelect={onSelect} />
    </>
  ));
  await settle();
  const input = q<HTMLInputElement>(".so-combobox__input");
  input.focus();
  input.click();

  press(input, "Enter", { isComposing: true });
  press(q(".so-command__input"), "Enter", { isComposing: true });

  expect(onChange).not.toHaveBeenCalled();
  expect(onSelect).not.toHaveBeenCalled();
});

it("Combobox commits a pick on click, not on the press that starts a touch scroll", () => {
  const onChange = vi.fn();
  mount(() => <ComboboxControl options={letters} onChange={onChange} />);
  const input = q<HTMLInputElement>("input");
  input.focus();
  input.click();
  const option = q<HTMLElement>('[role="option"]');

  option.dispatchEvent(new MouseEvent("mousedown", { bubbles: true, cancelable: true }));
  expect(onChange).not.toHaveBeenCalled();
  option.click();

  expect(onChange).toHaveBeenCalledWith("a");
});

it("Tree gives focus to the element that carries the treeitem role", () => {
  const root = mount(() => <Tree nodes={[{ id: "a", label: "A" }]} expanded={[]} onExpandedChange={() => {}} />);
  root.querySelector<HTMLButtonElement>(".so-tree__row")?.focus();

  expect(document.activeElement?.getAttribute("role")).toBe("treeitem");
  expect(document.activeElement?.getAttribute("aria-level")).toBe("1");
});

it("Tooltip is dismissed with Escape while shown", () => {
  mount(() => (
    <Tooltip content="tip">
      <button>b</button>
    </Tooltip>
  ));
  const button = q<HTMLButtonElement>("button");
  button.focus();

  const e = press(button, "Escape");

  expect(q(".so-tooltip-wrapper").classList.contains("so-tooltip-wrapper--dismissed")).toBe(true);
  expect(e.defaultPrevented).toBe(true);
});

it("Menu closes on a pointer press outside, which touch always delivers", async () => {
  const [open, setOpen] = createSignal(false);
  mount(() => (
    <Menu open={open()} onOpenChange={setOpen} trigger="Actions">
      <MenuItem>Edit</MenuItem>
    </Menu>
  ));
  setOpen(true);
  await settle();

  document.body.dispatchEvent(new MouseEvent("pointerdown", { bubbles: true }));

  expect(open()).toBe(false);
});
