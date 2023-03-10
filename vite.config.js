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
    emptyOutDir: process.env.buildFile ? false : true,
    lib: {
      entry: resolve(
        __dirname,
        `src/js/index${process.env.buildFile === "umd" ? ".umd" : ""}.js`
      ),
      formats: process.env.buildFile ? ["umd"] : ["es"],
      name: "te",
      fileName: (format) => `js/tw-elements.${format}.min.js`,
    },
    sourcemap: true,
  },
});
