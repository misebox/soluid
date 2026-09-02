// @vitest-environment jsdom
import { createSignal } from "solid-js";
import type { JSX } from "solid-js";
import { render } from "solid-js/web";
import { afterEach, expect, it, vi } from "vitest";
import { Checkbox } from "../components/ui/soluid/Checkbox";
import { FileUpload } from "../components/ui/soluid/FileUpload";
import { NumberInput } from "../components/ui/soluid/NumberInput";
import { PinInput } from "../components/ui/soluid/PinInput";
import type { PinInputProps } from "../components/ui/soluid/PinInput";
import { SearchField } from "../components/ui/soluid/SearchField";
import { Switch } from "../components/ui/soluid/Switch";
import { TextField } from "../components/ui/soluid/TextField";

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

function q<T extends Element>(selector: string): T {
  const el = host?.querySelector<T>(selector);
  if (!el) throw new Error(`missing ${selector}`);
  return el;
}

function type(input: HTMLInputElement, text: string) {
  input.value = text;
  input.dispatchEvent(new Event("input", { bubbles: true }));
}

function press(el: Element, key: string, init: KeyboardEventInit = {}) {
  el.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true, ...init }));
}

function mountPin(initial: string[], extra: Partial<PinInputProps> = {}) {
  const [value, setValue] = createSignal(initial);
  mount(() => <PinInput length={initial.length} value={value()} onChange={setValue} {...extra} />);
  const boxes = () => Array.from(host?.querySelectorAll<HTMLInputElement>("input") ?? []);
  return { value, boxes };
}

it("PinInput keeps focus in the box cleared by Backspace", () => {
  const { value, boxes } = mountPin(["1", "2", "", ""]);
  const box = boxes()[1];
  box.focus();

  press(box, "Backspace");

  expect(value()).toEqual(["1", "", "", ""]);
  expect(document.activeElement).toBe(boxes()[1]);
});

it("PinInput keeps each box bound to its position after a paste", () => {
  const { value, boxes } = mountPin(["2", "", "", ""]);
  const paste = new Event("paste", { bubbles: true, cancelable: true });
  Object.defineProperty(paste, "clipboardData", { value: { getData: () => "12" } });
  boxes()[0].dispatchEvent(paste);
  expect(value()).toEqual(["1", "2", "", ""]);

  type(boxes()[1], "9");

  expect(value()).toEqual(["1", "9", "", ""]);
});

it("PinInput does not re-fire onComplete for a rejected character", () => {
  const onComplete = vi.fn();
  const { boxes } = mountPin(["1", "2", "3", "4"], { onComplete });

  type(boxes()[0], "a");

  expect(onComplete).not.toHaveBeenCalled();
});

it("PinInput spreads a whole code arriving in one input event across the boxes", () => {
  const { value, boxes } = mountPin(["", "", "", "", "", ""]);

  type(boxes()[0], "123456");

  expect(value()).toEqual(["1", "2", "3", "4", "5", "6"]);
});

it("PinInput clears a box whose character was deleted", () => {
  const { value, boxes } = mountPin(["1", "2", "", ""]);

  type(boxes()[0], "");

  expect(value()).toEqual(["", "2", "", ""]);
});

it("SearchField ignores the Enter that confirms an IME composition", () => {
  const onSearch = vi.fn();
  mount(() => <SearchField value="東京" onSearch={onSearch} />);

  press(q("input"), "Enter", { isComposing: true });

  expect(onSearch).not.toHaveBeenCalled();
});

it("SearchField searches what is in the box", () => {
  const onSearch = vi.fn();
  mount(() => <SearchField onSearch={onSearch} />);
  const input = q<HTMLInputElement>("input");

  type(input, "foo");
  press(input, "Enter");

  expect(onSearch).toHaveBeenCalledWith("foo");
});

it("SearchField keeps focus in the field after clearing", () => {
  const [value, setValue] = createSignal("abc");
  mount(() => <SearchField value={value()} onInput={setValue} />);
  const clear = q<HTMLButtonElement>(".so-search-field__clear");
  clear.focus();

  clear.click();

  expect(document.activeElement).toBe(q("input"));
});

it("SearchField disables the clear button along with the field", () => {
  const onInput = vi.fn();
  mount(() => <SearchField value="abc" onInput={onInput} disabled />);

  q<HTMLButtonElement>(".so-search-field__clear").click();

  expect(onInput).not.toHaveBeenCalled();
});

it("NumberInput buttons respect readOnly", () => {
  const onInput = vi.fn();
  mount(() => <NumberInput label="n" value={1} onInput={onInput} readOnly />);

  q<HTMLButtonElement>('[aria-label="Increment"]').click();

  expect(onInput).not.toHaveBeenCalled();
});

it("NumberInput repaints the stored value when an emptied field blurs", () => {
  const [value, setValue] = createSignal(5);
  mount(() => <NumberInput label="n" value={value()} onInput={setValue} />);
  const input = q<HTMLInputElement>("input");

  type(input, "");
  input.dispatchEvent(new FocusEvent("blur"));

  expect(input.value).toBe(String(value()));
});

it("NumberInput shows the value a clamping parent kept after blur", () => {
  const [value, setValue] = createSignal(5);
  mount(() => <NumberInput label="n" max={5} value={value()} onInput={(v) => setValue(Math.min(v, 5))} />);
  const input = q<HTMLInputElement>("input");

  type(input, "7");
  input.dispatchEvent(new FocusEvent("blur"));

  expect(input.value).toBe("5");
});

it("Checkbox toggles on its own without a checked prop", () => {
  const onChange = vi.fn();
  mount(() => <Checkbox label="x" onChange={onChange} />);
  const input = q<HTMLInputElement>("input");

  input.click();
  input.click();

  expect(onChange.mock.calls.map((call) => call[0])).toEqual([true, false]);
});

it("Switch toggles on its own without a checked prop", () => {
  const onChange = vi.fn();
  mount(() => <Switch label="x" onChange={onChange} />);
  const button = q<HTMLButtonElement>("button");

  button.click();

  expect(button.getAttribute("aria-checked")).toBe("true");
  expect(onChange).toHaveBeenCalledWith(true);
});

it("FileUpload passes a single file from a drop when multiple is off", () => {
  const onSelect = vi.fn();
  mount(() => <FileUpload onSelect={onSelect} />);
  const drop = new Event("drop", { bubbles: true, cancelable: true });
  Object.defineProperty(drop, "dataTransfer", {
    value: { files: [new File(["a"], "a.txt"), new File(["b"], "b.txt")] },
  });

  q(".so-file-upload__zone").dispatchEvent(drop);

  expect(onSelect.mock.calls[0][0]).toHaveLength(1);
});

it("FileUpload refuses a drop while disabled", () => {
  mount(() => <FileUpload onSelect={() => {}} disabled />);
  const over = new Event("dragover", { bubbles: true, cancelable: true });
  const dataTransfer = { dropEffect: "copy" };
  Object.defineProperty(over, "dataTransfer", { value: dataTransfer });

  q(".so-file-upload__zone").dispatchEvent(over);

  expect(dataTransfer.dropEffect).toBe("none");
});

it("puts density on the field as data-density", () => {
  mount(() => <TextField label="Name" density="dense" />);
  const field = q(".so-form-field");

  expect(field.getAttribute("density")).toBeNull();
  expect(field.getAttribute("data-density")).toBe("dense");
});

it("does not leak density onto a checkbox input", () => {
  mount(() => <Checkbox label="x" density="dense" />);

  expect(q("input").getAttribute("density")).toBeNull();
});

it("Checkbox creates its children once", () => {
  let calls = 0;
  const Probe = () => {
    calls += 1;
    return <span>p</span>;
  };
  mount(() => (
    <Checkbox>
      <Probe />
    </Checkbox>
  ));

  expect(calls).toBe(1);
});

it("TextField does not describe itself by a hint that is not rendered", () => {
  mount(() => <TextField label="Name" />);

  expect(q("input").getAttribute("aria-describedby")).toBeNull();
});
