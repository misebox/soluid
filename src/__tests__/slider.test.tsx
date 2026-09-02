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

it("paints the track from min rather than from zero when there is no value", () => {
  const input = mount(() => <Slider label="s" min={10} max={110} />);

  expect(input.style.getPropertyValue("--so-slider-progress")).toBe("0%");
});

it("measures progress from min, not from zero", () => {
  const input = mount(() => <Slider label="s" min={100} max={200} value={150} />);

  expect(input.style.getPropertyValue("--so-slider-progress")).toBe("50%");
});

it("puts the thumb back when the parent keeps the old value", async () => {
  // Otherwise the thumb sits where the drag ended while the filled track and
  // the readout still show the value the model holds.
  const input = mount(() => <Slider label="s" value={3} min={1} max={5} step={1} onInput={() => {}} />);

  input.value = "5";
  input.dispatchEvent(new Event("input", { bubbles: true }));
  await Promise.resolve();

  expect(input.value).toBe("3");
});

it("leaves the thumb alone when the parent accepts the new value", async () => {
  const [value, setValue] = createSignal(3);
  const input = mount(() => <Slider label="s" value={value()} min={1} max={5} step={1} onInput={setValue} />);

  input.value = "5";
  input.dispatchEvent(new Event("input", { bubbles: true }));
  await Promise.resolve();

  expect(value()).toBe(5);
  expect(input.value).toBe("5");
});

it("leaves an uncontrolled slider where the user put it", async () => {
  // Without a value prop there is no model to disagree with; comparing against
  // one pinned the thumb to min.
  const seen: number[] = [];
  const input = mount(() => <Slider label="s" min={1} max={5} step={1} onInput={(v) => seen.push(v)} />);

  input.value = "4";
  input.dispatchEvent(new Event("input", { bubbles: true }));
  await Promise.resolve();

  expect(seen).toEqual([4]);
  expect(input.value).toBe("4");
});
