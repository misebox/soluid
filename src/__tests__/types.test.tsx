// @vitest-environment jsdom
import type { JSX } from "solid-js";
import { render } from "solid-js/web";
import { afterEach, expect, it, vi } from "vitest";
import { Carousel } from "../components/ui/soluid/Carousel";
import { Collapsible } from "../components/ui/soluid/Collapsible";
import { ColorPickerControl } from "../components/ui/soluid/ColorPicker";
import { ComboboxControl } from "../components/ui/soluid/Combobox";
import { ContextMenu } from "../components/ui/soluid/ContextMenu";
import { DatePickerControl } from "../components/ui/soluid/DatePicker";
import { NumberInput } from "../components/ui/soluid/NumberInput";
import { SliderInput } from "../components/ui/soluid/Slider";
import { Table } from "../components/ui/soluid/Table";
import { TimePickerControl } from "../components/ui/soluid/TimePicker";
import { ToastContainer } from "../components/ui/soluid/Toast";

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

// The props types are the public API, so a few usages are pinned at compile time.
// A `@ts-expect-error` that stops erroring fails `tsc`.
function typeChecks() {
  // @ts-expect-error the arrow keys are the Carousel's own
  <Carousel index={0} onIndexChange={() => {}} onKeyDown={() => {}} />;
  // @ts-expect-error opening the menu is the ContextMenu's own
  <ContextMenu content={<span />} onContextMenu={() => {}} />;
  // @ts-expect-error the live-region attributes are the container's own
  <ToastContainer toasts={[]} onDismiss={() => {}} aria-live="assertive" />;
  <DatePickerControl onBlur={() => {}} data-x="1" />;
  <ComboboxControl options={[]} onBlur={() => {}} />;
}
void typeChecks;

it("Collapsible takes JSX as its title", () => {
  mount(() => (
    <Collapsible open onOpenChange={() => {}} title={<b>Trigger</b>}>
      body
    </Collapsible>
  ));

  expect(q("button").querySelector("b")?.textContent).toBe("Trigger");
});

it("Table accepts rows typed by an interface", () => {
  interface User {
    id: number;
    name: string;
  }
  const users: User[] = [{ id: 1, name: "one" }];
  mount(() => <Table data={users} columns={[{ key: "name", header: "Name" }]} rowKey={(row) => String(row.id)} />);

  expect(q("tbody td").textContent).toBe("one");
});

it("DatePickerControl forwards native button attributes", () => {
  const onBlur = vi.fn();
  mount(() => <DatePickerControl onBlur={onBlur} />);
  const trigger = q<HTMLButtonElement>(".so-date-picker__trigger");

  trigger.dispatchEvent(new FocusEvent("blur"));

  expect(onBlur).toHaveBeenCalled();
});

it("Combobox, TimePicker and ColorPicker submit their value under a name", () => {
  mount(() => (
    <form>
      <ComboboxControl name="letter" options={[{ value: "a", label: "A" }]} value="a" />
      <TimePickerControl name="time" value="09:30" />
      <ColorPickerControl name="color" value="#ff0000" />
    </form>
  ));
  const data = new FormData(q<HTMLFormElement>("form"));

  expect(data.get("letter")).toBe("a");
  expect(data.get("time")).toBe("09:30");
  expect(data.get("color")).toBe("#ff0000");
});

it("NumberInput renders without a label", () => {
  mount(() => <NumberInput aria-label="Amount" value={3} />);

  expect(q<HTMLInputElement>("input").value).toBe("3");
  expect(host?.querySelector("label")).toBeNull();
});

it("NumberInput keeps what was typed when used uncontrolled", () => {
  mount(() => <NumberInput label="n" />);
  const input = q<HTMLInputElement>("input");

  input.value = "5";
  input.dispatchEvent(new Event("input", { bubbles: true }));
  input.dispatchEvent(new FocusEvent("blur"));

  expect(input.value).toBe("5");
});

it("NumberInput steppers respect the lowercase readonly attribute", () => {
  const onInput = vi.fn();
  mount(() => <NumberInput label="n" value={1} onInput={onInput} readonly />);

  q<HTMLButtonElement>('[aria-label="Increment"]').click();

  expect(onInput).not.toHaveBeenCalled();
});

it("SliderInput merges a caller style with its own", () => {
  mount(() => <SliderInput value={2} style={{ color: "red" }} />);
  const input = q<HTMLInputElement>("input");

  expect(input.style.color).toBe("red");
  expect(input.style.getPropertyValue("--so-slider-progress")).toBe("2%");
});
