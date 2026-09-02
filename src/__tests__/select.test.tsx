// @vitest-environment jsdom
import { createSignal } from "solid-js";
import type { JSX } from "solid-js";
import { render } from "solid-js/web";
import { afterEach, expect, it } from "vitest";
import type { SelectOption } from "../components/ui/soluid/Select";
import { Select, SelectInput } from "../components/ui/soluid/Select";

let dispose: (() => void) | undefined;
let host: HTMLElement | undefined;

afterEach(() => {
  dispose?.();
  host?.remove();
  dispose = undefined;
  host = undefined;
});

const letters: SelectOption[] = [
  { value: "a", label: "A" },
  { value: "b", label: "B" },
  { value: "c", label: "C" },
];

function mount(node: () => JSX.Element) {
  host = document.createElement("div");
  document.body.append(host);
  dispose = render(node, host);
  const select = host.querySelector("select");
  if (!select) throw new Error("select not rendered");
  return select;
}

it("shows a non-first initial value", () => {
  const select = mount(() => <SelectInput options={letters} value="b" />);

  expect(select.value).toBe("b");
});

it("shows a non-first initial value alongside a placeholder", () => {
  const select = mount(() => <SelectInput options={letters} value="c" placeholder="Pick" />);

  expect(select.value).toBe("c");
});

it("shows a non-first initial value inside a labelled field", () => {
  const select = mount(() => <Select label="Letter" options={letters} value="c" />);

  expect(select.value).toBe("c");
});

it("shows the placeholder while the value is empty", () => {
  const select = mount(() => <SelectInput options={letters} value="" placeholder="Pick" />);

  expect(select.value).toBe("");
  expect(select.selectedOptions[0]?.textContent).toBe("Pick");
});

it("follows a later value change", () => {
  const [value, setValue] = createSignal("a");
  const select = mount(() => <SelectInput options={letters} value={value()} />);

  setValue("c");

  expect(select.value).toBe("c");
});

it("keeps the value selected when the options arrive later", () => {
  const [options, setOptions] = createSignal<SelectOption[]>([]);
  const select = mount(() => <SelectInput options={options()} value="c" />);

  setOptions(letters);

  expect(select.value).toBe("c");
});
