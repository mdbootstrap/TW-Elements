import { defineConfig } from "vite";
import { resolve } from "path";
import glob from "glob";
import path from "node:path";
import { fileURLToPath } from "node:url";

const distName = process.env.mode === "demo" ? "./dist-demo" : "./dist";

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  define: {
    // for popper to not crash in docs
    "process.env": {},
    initiatedComponents: [],
  },
  build: {
    outDir: distName,
    emptyOutDir: process.env.buildFile ? false : true,
    lib: process.env.mode !== "demo" && {
      entry: resolve(
        __dirname,
        `src/js/index.${process.env.buildFile === "umd" ? "umd" : "es"}.js`
      ),
      formats: process.env.buildFile ? ["umd"] : ["es"],
      name: "te",
      fileName: (format) => `tw-elements.${format}.min.js`,
    },
    rollupOptions: {
      input: process.env.mode === "demo" && {
        index: "index.html",
        ...Object.fromEntries(
          glob
            .sync("demo/**/*.html")
            .map((file) => [
              path.relative(
                "demo",
                file.slice(0, file.length - path.extname(file).length)
              ),
              fileURLToPath(new URL(file, import.meta.url)),
            ])
        ),
      },
      output: {
        dir: "dist/js",
        chunkFileNames: ({ name }) => {
          const omitPhrase = [".umd", ".es", ".esm"];
          omitPhrase.forEach((omit) => (name = name.replace(omit, "")));
          return `${name}.[format].js`;
        },
      },
    },
    sourcemap: true,
  },
});
