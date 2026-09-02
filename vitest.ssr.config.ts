import solid from "vite-plugin-solid";
import { defineConfig } from "vitest/config";

/**
 * The browser suite pins `resolve.conditions` to the client build, so `isServer`
 * is always false there and no test can see server-only output. This config
 * renders the same components the way a server would.
 */
export default defineConfig({
  plugins: [solid({ ssr: true })],
  resolve: { conditions: ["node", "solid"] },
  test: {
    include: ["src/__ssr__/**/*.test.tsx"],
    environment: "node",
  },
});
