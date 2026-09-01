// @vitest-environment jsdom
import { render } from "solid-js/web";
import { afterEach, expect, it } from "vitest";
import { Calendar } from "../components/ui/soluid/Calendar";

let dispose: (() => void) | undefined;
let host: HTMLElement | undefined;

afterEach(() => {
  dispose?.();
  host?.remove();
  dispose = undefined;
  host = undefined;
});

function mount(ui: () => ReturnType<typeof Calendar>) {
  host = document.createElement("div");
  document.body.append(host);
  dispose = render(ui, host);
  return host;
}

function press(el: Element, key: string): void {
  el.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true }));
}

it("moves focus within its own grid when another calendar shows the same month", async () => {
  const root = mount(() => (
    <>
      <Calendar month="2026-05" label="first" />
      <Calendar month="2026-05" label="second" />
    </>
  ));

  const second = root.querySelectorAll(".so-calendar")[1];
  const day = second.querySelector<HTMLButtonElement>('[data-so-day="2026-05-10"]');
  day?.focus();
  press(day as Element, "ArrowRight");
  await Promise.resolve();

  expect(document.activeElement?.getAttribute("data-so-day")).toBe("2026-05-11");
  expect(second.contains(document.activeElement)).toBe(true);
});

it("puts the tab stop on a day that can actually be reached", () => {
  const root = mount(() => <Calendar month="2026-05" min="2026-05-20" />);

  const tabStop = root.querySelector<HTMLButtonElement>('.so-calendar__day[tabindex="0"]');

  expect(tabStop).not.toBeNull();
  expect(tabStop?.disabled).toBe(false);
});
