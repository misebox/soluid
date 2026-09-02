import { expect, it } from "vitest";
import { createTheme } from "../components/ui/soluid/core/theme";

it("createTheme accepts the three-digit hex shorthand", () => {
  const { cssText } = createTheme([{ name: "brand", base: "#abc" }]);

  expect(cssText).not.toContain("NaN");
  expect(cssText).toContain("#aabbcc");
});

it("keeps a white foreground on a mid-lightness base, where dark text fails", () => {
  // #808080 sits at L=50.2%: dark text on it is about 3.9:1.
  const { cssText } = createTheme([{ name: "mid", base: "#808080" }]);

  expect(cssText).toContain("--so-color-mid-fg: #ffffff;");
});
