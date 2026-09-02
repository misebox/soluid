// @vitest-environment jsdom
import { createSignal } from "solid-js";
import type { JSX } from "solid-js";
import { render } from "solid-js/web";
import { afterEach, expect, it, vi } from "vitest";
import { Checkbox } from "../components/ui/soluid/Checkbox";
import { ColorPickerControl } from "../components/ui/soluid/ColorPicker";
import { ComboboxControl } from "../components/ui/soluid/Combobox";
import { CommandPalette } from "../components/ui/soluid/CommandPalette";
import { DatePickerControl } from "../components/ui/soluid/DatePicker";
import { Rating } from "../components/ui/soluid/Rating";
import { Tag } from "../components/ui/soluid/Tag";
import { TimePickerControl } from "../components/ui/soluid/TimePicker";
import { Tooltip } from "../components/ui/soluid/Tooltip";

if (!Element.prototype.scrollIntoView) Element.prototype.scrollIntoView = () => {};

const cleanups: (() => void)[] = [];

afterEach(() => {
  while (cleanups.length > 0) cleanups.pop()?.();
  document.body.replaceChildren();
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

function press(el: Element | null, key: string) {
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

it("Combobox drops its list and stops emitting once disabled", async () => {
  const onChange = vi.fn();
  const [disabled, setDisabled] = createSignal(false);
  mount(() => <ComboboxControl options={letters} onChange={onChange} disabled={disabled()} />);
  const input = q<HTMLInputElement>("input");
  input.focus();
  input.click();

  setDisabled(true);
  await settle();
  document.querySelector<HTMLElement>(".so-combobox__option")?.click();

  expect(onChange).not.toHaveBeenCalled();
  expect(input.getAttribute("aria-expanded")).toBe("false");
});

it("TimePicker drops its list once disabled", async () => {
  const onChange = vi.fn();
  const [disabled, setDisabled] = createSignal(false);
  mount(() => <TimePickerControl value="09:00" onChange={onChange} disabled={disabled()} />);
  q<HTMLButtonElement>(".so-time-picker__trigger").click();

  setDisabled(true);
  await settle();
  document.querySelector<HTMLElement>(".so-time-picker__option")?.click();

  expect(onChange).not.toHaveBeenCalled();
  expect(document.querySelector(".so-time-picker__list")).toBeNull();
});

it("DatePicker drops its panel once disabled", async () => {
  const onChange = vi.fn();
  const [disabled, setDisabled] = createSignal(false);
  mount(() => <DatePickerControl value="2026-05-15" onChange={onChange} disabled={disabled()} />);
  q<HTMLButtonElement>(".so-date-picker__trigger").click();
  await settle();

  setDisabled(true);
  await settle();
  document.querySelector<HTMLButtonElement>('[data-so-day="2026-05-20"]')?.click();

  expect(onChange).not.toHaveBeenCalled();
  expect(document.querySelector(".so-date-picker__panel")).toBeNull();
});

it("ColorPicker drops its panel once disabled", async () => {
  const onChange = vi.fn();
  const [disabled, setDisabled] = createSignal(false);
  mount(() => <ColorPickerControl value="#ff0000" onChange={onChange} disabled={disabled()} />);
  q<HTMLButtonElement>(".so-color-picker__trigger").click();

  setDisabled(true);
  await settle();
  document.querySelector<HTMLButtonElement>(".so-color-picker__swatch")?.click();

  expect(onChange).not.toHaveBeenCalled();
  expect(document.querySelector(".so-color-picker__panel")).toBeNull();
});

it("Combobox keeps a usable highlight after the options shrink while open", async () => {
  const [options, setOptions] = createSignal(letters);
  const onChange = vi.fn();
  mount(() => <ComboboxControl options={options()} onChange={onChange} />);
  const input = q<HTMLInputElement>("input");
  input.focus();
  input.click();
  press(input, "ArrowDown");
  press(input, "ArrowDown");

  setOptions([{ value: "z", label: "Z" }]);
  await settle();

  expect(document.querySelector(".so-combobox__option--active")).not.toBeNull();
  press(input, "Enter");
  expect(onChange).toHaveBeenCalledWith("z");
});

it("TimePicker keeps its highlight on an existing row when step changes while open", async () => {
  const [step, setStep] = createSignal(30);
  mount(() => <TimePickerControl value="23:00" step={step()} />);
  const trigger = q<HTMLButtonElement>(".so-time-picker__trigger");
  trigger.click();

  setStep(60);
  await settle();

  const activeId = trigger.getAttribute("aria-activedescendant") ?? "";
  expect(document.getElementById(activeId)).not.toBeNull();
});

it("CommandPalette keeps its highlight on an existing row when commands shrink", async () => {
  const [commands, setCommands] = createSignal([
    { id: "a", label: "Alpha" },
    { id: "b", label: "Beta" },
    { id: "c", label: "Gamma" },
  ]);
  const onSelect = vi.fn();
  mount(() => <CommandPalette open onOpenChange={() => {}} commands={commands()} onSelect={onSelect} />);
  await settle();
  const input = q<HTMLInputElement>(".so-command__input");
  press(input, "End");

  setCommands([{ id: "a", label: "Alpha" }]);
  await settle();
  press(input, "Enter");

  expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: "a" }));
});

it("Rating keeps a tab stop when max shrinks below the value", () => {
  const [max, setMax] = createSignal(5);
  const root = mount(() => <Rating value={5} max={max()} onChange={() => {}} />);

  setMax(3);

  expect(root.querySelector('[role="radio"][tabindex="0"]')).not.toBeNull();
});

it("Tooltip keeps focus on the trigger when its content is cleared", () => {
  const [content, setContent] = createSignal<string | undefined>("tip");
  mount(() => (
    <Tooltip content={content()}>
      <button>b</button>
    </Tooltip>
  ));
  const button = q<HTMLButtonElement>("button");
  button.focus();

  setContent(undefined);

  expect(button.getAttribute("aria-describedby")).toBeNull();
  expect(document.activeElement).toBe(button);
});

it("Tag keeps its remove button when onRemove changes identity", () => {
  const [onRemove, setOnRemove] = createSignal<() => void>(() => {});
  mount(() => <Tag onRemove={onRemove()}>t</Tag>);
  const button = q<HTMLButtonElement>(".so-tag__remove");
  button.focus();

  setOnRemove(() => () => {});

  expect(document.activeElement).toBe(button);
});

it("Checkbox follows a controlled parent that keeps the old value", () => {
  mount(() => <Checkbox label="c" checked={false} onChange={() => {}} />);
  const input = q<HTMLInputElement>("input");

  input.click();

  expect(input.checked).toBe(false);
});
