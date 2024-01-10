/*
--------------------------------------------------------------------------
TW Elements is an open-source UI kit of advanced components for TailwindCSS.
Copyright © 2023 MDBootstrap.com

Unless a custom, individually assigned license has been granted, this program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
In addition, a custom license may be available upon request, subject to the terms and conditions of that license. Please contact tailwind@mdbootstrap.com for more information on obtaining a custom license.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

If you would like to purchase a COMMERCIAL, non-AGPL license for TWE, please check out our pricing: https://tw-elements.com/pro/
--------------------------------------------------------------------------
*/

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
          const omitPhrase = [".umd", ".esm", ".es"];
          omitPhrase.forEach((omit) => (name = name.replace(omit, "")));
          return `${name}.[format].js`;
        },
      },
    },
    sourcemap: true,
  },
});
