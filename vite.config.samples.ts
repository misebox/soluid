import { resolve } from "node:path";
import { defineConfig } from "vite";
import solid from "vite-plugin-solid";

export default defineConfig({
  plugins: [solid()],
  root: "src/samples",
  base: "/soluid/samples/",
  build: {
    outDir: resolve(__dirname, "docs/samples"),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        dashboard: resolve(__dirname, "src/samples/dashboard/index.html"),
        settings: resolve(__dirname, "src/samples/settings/index.html"),
        mail: resolve(__dirname, "src/samples/mail/index.html"),
        shop: resolve(__dirname, "src/samples/shop/index.html"),
      },
    },
  },
});
