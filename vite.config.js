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
    emptyOutDir: true,
    lib: {
      entry: {
        "js/index": resolve(__dirname, "src/js/index.js"),
      },
      name: "te",
      fileName: () => "js/index.min.js",
      formats: ["es"],
    },
    sourcemap: true,
  },
});
