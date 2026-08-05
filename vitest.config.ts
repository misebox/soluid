import solid from "vite-plugin-solid";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [solid()],
  // Solid ships separate server and browser builds; tests need the browser one.
  resolve: { conditions: ["development", "browser"] },
  test: {
    include: ["cli/__tests__/**/*.test.ts", "src/__tests__/**/*.test.tsx"],
  },
});
