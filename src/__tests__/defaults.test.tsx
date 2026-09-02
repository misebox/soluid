// @vitest-environment jsdom
import { readFileSync } from "node:fs";
import type { JSX } from "solid-js";
import { render } from "solid-js/web";
import { afterEach, expect, it } from "vitest";
import { PinInput } from "../components/ui/soluid/PinInput";
import { Rating } from "../components/ui/soluid/Rating";
import { SliderInput } from "../components/ui/soluid/Slider";
import { TimePickerControl } from "../components/ui/soluid/TimePicker";

/**
 * The catalog reads a prop's default out of the `local.x ?? …` in the source,
 * so a guard written around that expression silently rewrites the documentation.
 * Each case pins the published default against what the component actually does
 * when the prop is left out.
 */
interface PropInfo {
  name: string;
  default?: string;
}
const api = JSON.parse(readFileSync("src/dev/api-data.json", "utf-8")) as { name: string; props: PropInfo[] }[];

function documentedDefault(type: string, prop: string): string | undefined {
  return api.find((entry) => entry.name === type)?.props.find((p) => p.name === prop)?.default;
}

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

it("Rating shows as many stars as its documented default", () => {
  const root = mount(() => <Rating value={0} />);

  expect(documentedDefault("RatingProps", "max")).toBe("5");
  expect(root.querySelectorAll('[role="radio"]').length).toBe(5);
});

it("PinInput shows as many boxes as its documented default", () => {
  const root = mount(() => <PinInput value={[]} onChange={() => {}} />);

  expect(documentedDefault("PinInputProps", "length")).toBe("6");
  expect(root.querySelectorAll(".so-pin-input__box").length).toBe(6);
});

it("Slider spans its documented default range", () => {
  const root = mount(() => <SliderInput value={10} />);
  const input = root.querySelector("input");

  expect(documentedDefault("SliderInputProps", "min")).toBe("0");
  expect(documentedDefault("SliderInputProps", "max")).toBe("100");
  expect(input?.getAttribute("min")).toBe("0");
  expect(input?.getAttribute("max")).toBe("100");
});

it("TimePicker steps by its documented default", () => {
  mount(() => <TimePickerControl value="00:00" />);
  document.querySelector<HTMLButtonElement>(".so-time-picker__trigger")?.click();
  const times = [...document.querySelectorAll('[role="option"]')].map((el) => el.textContent);

  expect(documentedDefault("TimePickerControlProps", "step")).toBe("30");
  expect(times.slice(0, 3)).toEqual(["00:00", "00:30", "01:00"]);
});
