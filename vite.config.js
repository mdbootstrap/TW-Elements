import { defineConfig } from "vite";
import { resolve } from "path";

const distName = process.env.mode === "demo" ? "./dist-demo" : "./dist";

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  define: {
    // for popper to not crash in docs
    "process.env": {},
  },
  build: {
    outDir: distName,
    lib: {
      entry: resolve(__dirname, process.env.buildFile || "src/js/index.js"),

      name: "te",
      fileName: (format) => `js/tw-elements.${format}.min.js`,
    },
    sourcemap: true,
  },
});
