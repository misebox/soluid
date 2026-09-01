// @vitest-environment jsdom
import { createSignal } from "solid-js";
import { render } from "solid-js/web";
import { afterEach, expect, it } from "vitest";
import { NumberInput } from "../components/ui/soluid/NumberInput";

let dispose: (() => void) | undefined;
let host: HTMLElement | undefined;

afterEach(() => {
  dispose?.();
  host?.remove();
  dispose = undefined;
  host = undefined;
});

function mount(step: number, start: number, min?: number, max?: number) {
  host = document.createElement("div");
  document.body.append(host);
  const [value, setValue] = createSignal(start);
  dispose = render(
    () => <NumberInput label="Amount" step={step} min={min} max={max} value={value()} onInput={setValue} />,
    host,
  );
  const button = (label: string) => host?.querySelector<HTMLButtonElement>(`[aria-label="${label}"]`);
  return { value, increment: () => button("Increment")?.click(), decrement: () => button("Decrement")?.click() };
}

it("does not let a fractional step drift into floating point noise", () => {
  const { value, increment } = mount(0.1, 0);

  increment();
  increment();
  increment();

  expect(value()).toBe(0.3);
});

it("keeps the step exact going down as well", () => {
  const { value, decrement } = mount(0.1, 0.3);

  decrement();

  expect(value()).toBe(0.2);
});

it("stops at the bounds", () => {
  const { value, increment } = mount(1, 4, 0, 5);

  increment();
  increment();

  expect(value()).toBe(5);
});
