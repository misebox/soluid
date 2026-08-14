import { resolve } from "node:path";
import { defineConfig } from "vite";
import solid from "vite-plugin-solid";

export default defineConfig({
  plugins: [solid()],
  root: "src/samples",
  base: "/soluid/samples/",
  build: {
    outDir: resolve(import.meta.dirname, "docs/samples"),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        dashboard: resolve(import.meta.dirname, "src/samples/dashboard/index.html"),
        settings: resolve(import.meta.dirname, "src/samples/settings/index.html"),
        mail: resolve(import.meta.dirname, "src/samples/mail/index.html"),
        shop: resolve(import.meta.dirname, "src/samples/shop/index.html"),
      },
    },
  },
});
