import { defineConfig } from "vite";
import solid from "vite-plugin-solid";

export default defineConfig({
  plugins: [solid()],
  base: "/soluid/",
  build: {
    // emptyOutDir wipes all of docs/, including docs/samples/, so
    // `build:catalog` runs `build:samples` afterwards to put it back.
    outDir: "docs",
    emptyOutDir: true,
  },
});
