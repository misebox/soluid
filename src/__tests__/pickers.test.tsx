// @vitest-environment jsdom
import { createSignal } from "solid-js";
import type { JSX } from "solid-js";
import { render } from "solid-js/web";
import { afterEach, expect, it, vi } from "vitest";
import { Calendar } from "../components/ui/soluid/Calendar";
import { ColorPickerControl } from "../components/ui/soluid/ColorPicker";
import { ComboboxControl } from "../components/ui/soluid/Combobox";
import { DatePickerControl } from "../components/ui/soluid/DatePicker";
import { Dialog, DialogBody, DialogHeader } from "../components/ui/soluid/Dialog";
import { Rating } from "../components/ui/soluid/Rating";
import { SegmentedControl } from "../components/ui/soluid/SegmentedControl";
import { Select } from "../components/ui/soluid/Select";
import { TimePickerControl } from "../components/ui/soluid/TimePicker";

// A zone east of UTC, where the local date runs ahead of the UTC one.
process.env.TZ = "Asia/Tokyo";

const cleanups: (() => void)[] = [];

afterEach(() => {
  while (cleanups.length > 0) cleanups.pop()?.();
  document.body.replaceChildren();
  vi.useRealTimers();
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

function press(el: Element | null | undefined, key: string) {
  el?.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }));
}

async function settle() {
  await Promise.resolve();
  await Promise.resolve();
}

const letters = [
  { value: "a", label: "A" },
  { value: "b", label: "B" },
  { value: "c", label: "C" },
];

function inDialog(onClose: () => void, body: JSX.Element) {
  return (
    <Dialog open onClose={onClose}>
      <DialogHeader>Title</DialogHeader>
      <DialogBody>{body}</DialogBody>
    </Dialog>
  );
}

it("Escape in a combobox inside a Dialog closes only the list", async () => {
  const onClose = vi.fn();
  mount(() => inDialog(onClose, <ComboboxControl options={letters} />));
  await settle();
  const input = document.querySelector<HTMLInputElement>(".so-combobox__input");
  input?.focus();
  input?.click();
  expect(input?.getAttribute("aria-expanded")).toBe("true");

  press(input, "Escape");

  expect(input?.getAttribute("aria-expanded")).toBe("false");
  expect(onClose).not.toHaveBeenCalled();
});

it("Escape in a date picker inside a Dialog closes only the panel", async () => {
  const onClose = vi.fn();
  mount(() => inDialog(onClose, <DatePickerControl value="2026-05-15" />));
  await settle();
  const trigger = document.querySelector<HTMLButtonElement>(".so-date-picker__trigger");
  trigger?.click();
  await settle();

  press(document.querySelector('[data-so-day="2026-05-15"]'), "Escape");

  expect(trigger?.getAttribute("aria-expanded")).toBe("false");
  expect(onClose).not.toHaveBeenCalled();
});

it("Escape in a time picker inside a Dialog closes only the list", async () => {
  const onClose = vi.fn();
  mount(() => inDialog(onClose, <TimePickerControl value="09:00" />));
  await settle();
  const trigger = document.querySelector<HTMLButtonElement>(".so-time-picker__trigger");
  press(trigger, "ArrowDown");

  press(trigger, "Escape");

  expect(trigger?.getAttribute("aria-expanded")).toBe("false");
  expect(onClose).not.toHaveBeenCalled();
});

it("Calendar marks the viewer's local date as today", () => {
  vi.useFakeTimers({ toFake: ["Date"] });
  // 08:30 on May 2 in Tokyo, still May 1 in UTC.
  vi.setSystemTime(new Date("2026-05-01T23:30:00Z"));
  const root = mount(() => <Calendar />);

  expect(root.querySelector('[aria-current="date"]')?.getAttribute("data-so-day")).toBe("2026-05-02");
});

it("Calendar opens on the viewer's local month", () => {
  vi.useFakeTimers({ toFake: ["Date"] });
  // Already June 1 in Tokyo.
  vi.setSystemTime(new Date("2026-05-31T23:30:00Z"));
  const root = mount(() => <Calendar />);

  expect(root.querySelector('[data-so-day="2026-06-15"]')).not.toBeNull();
});

it("Calendar keeps focus in the grid after PageUp", async () => {
  const root = mount(() => <Calendar value="2026-05-15" />);
  const day = root.querySelector<HTMLButtonElement>('[data-so-day="2026-05-15"]');
  day?.focus();

  press(day, "PageUp");
  await Promise.resolve();

  expect(document.activeElement?.getAttribute("data-so-day")).toBe("2026-04-15");
});

it("Calendar stays put when arrowing past min", async () => {
  const root = mount(() => <Calendar value="2026-05-01" min="2026-05-01" />);
  const day = root.querySelector<HTMLButtonElement>('[data-so-day="2026-05-01"]');
  day?.focus();

  press(day, "ArrowLeft");
  await Promise.resolve();

  expect(root.querySelector('[data-so-day="2026-05-15"]')).not.toBeNull();
  expect(document.activeElement?.getAttribute("data-so-day")).toBe("2026-05-01");
});

it("Calendar does not PageUp into a month where every day is disabled", async () => {
  const root = mount(() => <Calendar value="2026-05-15" min="2026-05-01" />);
  const day = root.querySelector<HTMLButtonElement>('[data-so-day="2026-05-15"]');
  day?.focus();

  press(day, "PageUp");
  await Promise.resolve();

  expect(root.querySelector('[data-so-day="2026-05-15"]')).not.toBeNull();
  expect(root.querySelector<HTMLButtonElement>('.so-calendar__day[tabindex="0"]')?.disabled).toBe(false);
});

it("TimePicker drops its list when focus leaves via Tab", () => {
  const root = mount(() => (
    <>
      <TimePickerControl value="09:00" />
      <button id="next">next</button>
    </>
  ));
  const trigger = root.querySelector<HTMLButtonElement>(".so-time-picker__trigger");
  trigger?.focus();
  press(trigger, "ArrowDown");

  press(trigger, "Tab");

  expect(trigger?.getAttribute("aria-expanded")).toBe("false");
  expect(document.querySelector(".so-time-picker__list")).toBeNull();
});

it("SegmentedControl moves focus along with the selection", () => {
  const [value, setValue] = createSignal("a");
  const root = mount(() => <SegmentedControl options={letters} value={value()} onChange={setValue} />);
  const [first, second] = Array.from(root.querySelectorAll<HTMLButtonElement>('[role="radio"]'));
  first.focus();

  press(first, "ArrowRight");

  expect(value()).toBe("b");
  expect(document.activeElement).toBe(second);
});

it("Rating moves focus along with the selection", () => {
  const [value, setValue] = createSignal(2);
  const root = mount(() => <Rating value={value()} onChange={setValue} />);
  const stars = Array.from(root.querySelectorAll<HTMLButtonElement>('[role="radio"]'));
  stars[1].focus();

  press(stars[1], "ArrowRight");

  expect(value()).toBe(3);
  expect(document.activeElement).toBe(stars[2]);
});

it("SegmentedControl keeps a tab stop when the value matches no option", () => {
  const root = mount(() => <SegmentedControl options={letters} value="" onChange={() => {}} />);

  expect(root.querySelector('[role="radio"][tabindex="0"]')).not.toBeNull();
});

it("SegmentedControl keeps a reachable tab stop when the selected option is disabled", () => {
  const options = [{ value: "a", label: "A", disabled: true }, ...letters.slice(1)];
  const root = mount(() => <SegmentedControl options={options} value="a" onChange={() => {}} />);

  expect(root.querySelector<HTMLButtonElement>('[role="radio"][tabindex="0"]')?.disabled).toBe(false);
});

it("Combobox reopens when the still-focused input is clicked after a selection", () => {
  const [value, setValue] = createSignal<string>();
  const root = mount(() => <ComboboxControl options={letters} value={value()} onChange={setValue} />);
  const input = root.querySelector<HTMLInputElement>("input");
  input?.focus();
  input?.click();
  document.querySelectorAll<HTMLElement>('[role="option"]')[1]?.click();
  expect(value()).toBe("b");
  expect(document.activeElement).toBe(input);

  input?.click();

  expect(input?.getAttribute("aria-expanded")).toBe("true");
});

it("Combobox does not pop open just because a dialog handed it focus", async () => {
  mount(() => inDialog(() => {}, <ComboboxControl options={letters} />));
  await settle();
  const input = document.querySelector<HTMLInputElement>(".so-combobox__input");

  expect(document.activeElement).toBe(input);
  expect(input?.getAttribute("aria-expanded")).toBe("false");
});

it("Combobox does not start on a disabled first option", () => {
  const onChange = vi.fn();
  const options = [{ value: "a", label: "A", disabled: true }, ...letters.slice(1)];
  const root = mount(() => <ComboboxControl options={options} onChange={onChange} />);
  const input = root.querySelector<HTMLInputElement>("input");
  input?.focus();
  input?.click();
  const activeId = input?.getAttribute("aria-activedescendant") ?? "";
  expect(document.getElementById(activeId)?.getAttribute("aria-disabled")).toBeNull();

  press(input, "Enter");

  expect(onChange).toHaveBeenCalledWith("b");
});

it("Select puts density on the field as data-density", () => {
  const root = mount(() => <Select label="Letter" options={letters} density="dense" />);
  const field = root.querySelector(".so-form-field");

  expect(field?.getAttribute("data-density")).toBe("dense");
  expect(field?.hasAttribute("density")).toBe(false);
});

it("DatePicker submits its value under the given name", () => {
  const root = mount(() => (
    <form>
      <DatePickerControl name="d" value="2026-05-15" />
    </form>
  ));
  const form = root.querySelector("form") as HTMLFormElement;

  expect(new FormData(form).get("d")).toBe("2026-05-15");
});

it("ColorPicker names its panel and inputs by default", () => {
  mount(() => <ColorPickerControl value="#ff0000" />);
  document.querySelector<HTMLButtonElement>(".so-color-picker__trigger")?.click();

  const panel = document.querySelector(".so-color-picker__panel");
  expect(panel?.getAttribute("aria-label")).toBeTruthy();
  for (const input of panel?.querySelectorAll("input") ?? []) {
    expect(input.closest("label")?.textContent?.trim()).toBeTruthy();
  }
});
