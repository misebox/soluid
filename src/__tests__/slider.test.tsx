// @vitest-environment jsdom
import { createSignal } from "solid-js";
import type { JSX } from "solid-js";
import { render } from "solid-js/web";
import { afterEach, expect, it } from "vitest";
import { Slider } from "../components/ui/soluid/Slider";

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
  const input = host.querySelector("input");
  if (!input) throw new Error("input not rendered");
  return input;
}

it("shows an initial value above the default range", () => {
  const input = mount(() => <Slider label="s" value={500} min={0} max={1000} />);

  expect(input.value).toBe("500");
});

it("keeps the value when the bounds change with it", () => {
  const [state, setState] = createSignal({ value: 50, max: 100 });
  const input = mount(() => <Slider label="s" value={state().value} min={0} max={state().max} />);

  setState({ value: 500, max: 1000 });

  expect(input.value).toBe("500");
});
