// @vitest-environment jsdom
import type { JSX } from "solid-js";
import { render } from "solid-js/web";
import { afterEach, expect, it, vi } from "vitest";
import { AvatarGroup } from "../components/ui/soluid/AvatarGroup";
import { Avatar } from "../components/ui/soluid/Avatar";
import { Calendar } from "../components/ui/soluid/Calendar";
import { Carousel } from "../components/ui/soluid/Carousel";
import { ColorPickerControl } from "../components/ui/soluid/ColorPicker";
import { DatePickerControl } from "../components/ui/soluid/DatePicker";
import { Pagination } from "../components/ui/soluid/Pagination";
import { PinInput } from "../components/ui/soluid/PinInput";
import { Rating } from "../components/ui/soluid/Rating";
import { SliderInput } from "../components/ui/soluid/Slider";
import { TimePickerControl } from "../components/ui/soluid/TimePicker";

// jsdom has neither; Carousel needs both.
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

/** Every rendered attribute and every piece of text, as one string. */
function rendered(root: HTMLElement): string {
  const attributes = [...root.querySelectorAll("*")].flatMap((el) => [...el.attributes].map((a) => a.value));
  return [root.textContent ?? "", ...attributes].join(" ");
}

// A value that came from an API, a URL parameter or parseFloat("") must degrade
// visibly rather than take the render tree down.

for (const value of ["abc", "20260101", "   ", "01/15/2026"]) {
  it(`Calendar survives a value it cannot parse: ${JSON.stringify(value)}`, () => {
    const root = mount(() => <Calendar value={value} />);

    expect(root.querySelectorAll("[data-so-day]").length).toBeGreaterThan(0);
    expect(rendered(root)).not.toContain("NaN");
  });
}

for (const locale of ["en_US", "", "!!", "en-US-"]) {
  it(`Calendar survives a locale tag Intl rejects: ${JSON.stringify(locale)}`, () => {
    const root = mount(() => <Calendar locale={locale} />);

    expect(root.querySelectorAll("[data-so-day]").length).toBeGreaterThan(0);
  });
}

it("DatePicker survives a value it cannot parse", () => {
  const root = mount(() => <DatePickerControl value="not-a-date" />);
  root.querySelector<HTMLButtonElement>(".so-date-picker__trigger")?.click();

  expect(document.querySelectorAll("[data-so-day]").length).toBeGreaterThan(0);
});

it("Carousel keeps its slides reachable when the index is not a whole number", () => {
  const onIndexChange = vi.fn();
  const root = mount(() => (
    <Carousel index={Number.NaN} onIndexChange={onIndexChange}>
      <div>one</div>
      <div>two</div>
    </Carousel>
  ));
  const slides = [...root.querySelectorAll<HTMLElement & { inert?: boolean }>(".so-carousel__slide")];

  expect(slides.some((slide) => slide.inert !== true)).toBe(true);

  root.querySelector<HTMLButtonElement>(".so-carousel__nav--next")?.click();

  expect(onIndexChange).toHaveBeenCalledWith(1);
});

it("Pagination does not render a page called NaN while the count is loading", () => {
  const root = mount(() => <Pagination showPages page={1} totalPages={Number.NaN} onChange={() => {}} />);

  expect(rendered(root)).not.toContain("NaN");
});

it("AvatarGroup still shows its avatars when max is not a number", () => {
  const root = mount(() => (
    <AvatarGroup max={Number.NaN}>
      <Avatar name="A" />
      <Avatar name="B" />
    </AvatarGroup>
  ));

  expect(root.querySelectorAll(".so-avatar").length).toBe(2);
  expect(rendered(root)).not.toContain("NaN");
});

it("Rating and PinInput survive an unbounded count", () => {
  const root = mount(() => (
    <>
      <Rating value={1} max={Number.POSITIVE_INFINITY} />
      <PinInput value={[]} onChange={() => {}} length={Number.POSITIVE_INFINITY} />
    </>
  ));

  expect(root.querySelectorAll('[role="radio"]').length).toBeGreaterThan(0);
  expect(root.querySelectorAll(".so-pin-input__box").length).toBeGreaterThan(0);
});

it("Slider keeps NaN out of its attributes and its readout", () => {
  const root = mount(() => <SliderInput value={Number.NaN} min={Number.NaN} showValue />);

  expect(rendered(root)).not.toContain("NaN");
  expect(root.querySelector("input")?.getAttribute("min")).toBe("0");
});

it("TimePicker offers only whole minutes for a fractional step", () => {
  const root = mount(() => <TimePickerControl value="09:00" step={1.5} />);
  root.querySelector<HTMLButtonElement>(".so-time-picker__trigger")?.click();
  const times = [...document.querySelectorAll('[role="option"]')].map((el) => el.textContent ?? "");

  expect(times.length).toBeGreaterThan(0);
  for (const time of times) expect(time).toMatch(/^\d{2}:\d{2}$/);
});

it("ColorPicker survives a gap in the swatch list", () => {
  const swatches = ["#ff0000", undefined as unknown as string, "#00ff00"];
  const root = mount(() => <ColorPickerControl value="#ff0000" swatches={swatches} />);
  root.querySelector<HTMLButtonElement>(".so-color-picker__trigger")?.click();

  expect(document.querySelectorAll(".so-color-picker__swatch").length).toBe(3);
});
