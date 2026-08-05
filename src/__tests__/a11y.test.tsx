// @vitest-environment jsdom
import axe from "axe-core";
import { render } from "solid-js/web";
import { afterEach, expect, it } from "vitest";
import { DEMOS } from "../dev/pages/componentDemos";

/**
 * Every catalog demo, checked with axe.
 *
 * The demos double as fixtures so there is only one set of examples to keep
 * current. jsdom has no layout engine and does not apply the component CSS, so
 * only the rules that read the DOM structure can run here — colour contrast and
 * target size need a real browser and are checked separately.
 */
/* jsdom implements neither of these; Carousel uses both. */
if (!globalThis.ResizeObserver) {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}
if (!window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({ matches: false, media: query, addEventListener() {}, removeEventListener() {} }) as unknown as MediaQueryList;
}

const STRUCTURAL_RULES = [
  "aria-allowed-attr",
  "aria-allowed-role",
  "aria-hidden-focus",
  "aria-progressbar-name",
  "aria-required-attr",
  "aria-required-children",
  "aria-required-parent",
  "aria-roles",
  "aria-toggle-field-name",
  "aria-valid-attr",
  "aria-valid-attr-value",
  "button-name",
  "image-alt",
  "input-button-name",
  "label",
  "link-name",
  "role-img-alt",
  "select-name",
];

let dispose: (() => void) | undefined;
let host: HTMLElement | undefined;

afterEach(() => {
  dispose?.();
  host?.remove();
  dispose = undefined;
  host = undefined;
});

for (const [name, Demo] of Object.entries(DEMOS)) {
  it(`${name} has no structural accessibility violations`, async () => {
    host = document.createElement("div");
    document.body.appendChild(host);
    dispose = render(() => <Demo />, host);

    const result = await axe.run(host, { runOnly: STRUCTURAL_RULES });

    const failures = result.violations.map(
      (violation) => `${violation.id}: ${violation.nodes.map((node) => node.html).join(" | ")}`,
    );
    expect(failures).toEqual([]);
  });
}
