import { readFileSync } from "node:fs";
import { expect, it } from "vitest";

// Read from disk: Vite hands a `?raw` CSS import back empty under the test transform.
const css = readFileSync("src/components/ui/soluid/core/soluid.css", "utf-8");

/** The literal hex tokens of one theme block, keyed by token name. */
function tokensOf(selector: string): Record<string, string> {
  const block = css.slice(css.indexOf(`${selector} {`));
  const body = block.slice(0, block.indexOf("}"));
  return Object.fromEntries(
    [...body.matchAll(/(--so-[\w-]+):\s*(#[0-9a-f]{6})/gi)].map((match) => [match[1], match[2]]),
  );
}

function relativeLuminance(hex: string): number {
  const channels = [1, 3, 5].map((i) => Number.parseInt(hex.slice(i, i + 2), 16) / 255);
  const [r, g, b] = channels.map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const [x, y] = [relativeLuminance(a), relativeLuminance(b)];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

// The dark block only overrides what changes, so it falls back to the light one.
const light = tokensOf(":root");
const dark = { ...light, ...tokensOf('[data-theme="dark"]') };

for (const [theme, tokens] of [
  ["light", light],
  ["dark", dark],
] as const) {
  it(`${theme}: a control boundary is distinguishable from both backgrounds`, () => {
    // WCAG 1.4.11: the boundary that identifies a control needs 3:1.
    expect(contrast(tokens["--so-border-control"], tokens["--so-bg"])).toBeGreaterThanOrEqual(3);
    expect(contrast(tokens["--so-border-control"], tokens["--so-bg-subtle"])).toBeGreaterThanOrEqual(3);
  });

  it(`${theme}: body and muted text are readable on both backgrounds`, () => {
    for (const text of ["--so-text", "--so-text-muted"]) {
      expect(contrast(tokens[text], tokens["--so-bg"])).toBeGreaterThanOrEqual(4.5);
      expect(contrast(tokens[text], tokens["--so-bg-subtle"])).toBeGreaterThanOrEqual(4.5);
    }
  });

  it(`${theme}: the focus ring stands out from the page`, () => {
    expect(contrast(tokens["--so-color-primary-base"], tokens["--so-bg"])).toBeGreaterThanOrEqual(3);
  });

  it(`${theme}: white text is readable on every solid fill`, () => {
    for (const role of ["primary", "neutral", "danger", "success", "warning", "info"]) {
      const base = tokens[`--so-color-${role}-base`];
      expect(contrast("#ffffff", base), role).toBeGreaterThanOrEqual(4.5);
    }
  });
}

it("dark theme carries its own shadows, which black ones cannot provide", () => {
  const darkBlock = css.slice(css.indexOf('[data-theme="dark"] {'));
  expect(darkBlock.slice(0, darkBlock.indexOf("}"))).toContain("--so-shadow-md");
});
