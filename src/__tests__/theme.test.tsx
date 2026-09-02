import { expect, it } from "vitest";
import { createTheme } from "../components/ui/soluid/core/theme";

it("createTheme accepts the three-digit hex shorthand", () => {
  const { cssText } = createTheme([{ name: "brand", base: "#abc" }]);

  expect(cssText).not.toContain("NaN");
  expect(cssText).toContain("#aabbcc");
});
