// vite.config.js
import { defineConfig } from "file:///D:/Work/Repos/Tailwind-Elements/node_modules/vite/dist/node/index.js";
import { resolve } from "path";
import glob from "file:///D:/Work/Repos/Tailwind-Elements/node_modules/glob/glob.js";
import path from "node:path";
import { fileURLToPath } from "node:url";
var __vite_injected_original_dirname = "D:\\Work\\Repos\\Tailwind-Elements";
var __vite_injected_original_import_meta_url =
  "file:///D:/Work/Repos/Tailwind-Elements/vite.config.js";
var distName = process.env.mode === "demo" ? "./dist-demo" : "./dist";
var vite_config_default = defineConfig({
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
        __vite_injected_original_dirname,
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
              fileURLToPath(
                new URL(file, __vite_injected_original_import_meta_url)
              ),
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
export { vite_config_default as default };
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxXb3JrXFxcXFJlcG9zXFxcXFRhaWx3aW5kLUVsZW1lbnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxXb3JrXFxcXFJlcG9zXFxcXFRhaWx3aW5kLUVsZW1lbnRzXFxcXHZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9Xb3JrL1JlcG9zL1RhaWx3aW5kLUVsZW1lbnRzL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcclxuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gXCJwYXRoXCI7XHJcbmltcG9ydCBnbG9iIGZyb20gXCJnbG9iXCI7XHJcbmltcG9ydCBwYXRoIGZyb20gXCJub2RlOnBhdGhcIjtcclxuaW1wb3J0IHsgZmlsZVVSTFRvUGF0aCB9IGZyb20gXCJub2RlOnVybFwiO1xyXG5cclxuY29uc3QgZGlzdE5hbWUgPSBwcm9jZXNzLmVudi5tb2RlID09PSBcImRlbW9cIiA/IFwiLi9kaXN0LWRlbW9cIiA6IFwiLi9kaXN0XCI7XHJcblxyXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIGJhc2U6IFwiLi9cIixcclxuICBkZWZpbmU6IHtcclxuICAgIC8vIGZvciBwb3BwZXIgdG8gbm90IGNyYXNoIGluIGRvY3NcclxuICAgIFwicHJvY2Vzcy5lbnZcIjoge30sXHJcbiAgfSxcclxuICBidWlsZDoge1xyXG4gICAgb3V0RGlyOiBkaXN0TmFtZSxcclxuICAgIGVtcHR5T3V0RGlyOiBwcm9jZXNzLmVudi5idWlsZEZpbGUgPyBmYWxzZSA6IHRydWUsXHJcbiAgICBsaWI6IHByb2Nlc3MuZW52Lm1vZGUgIT09IFwiZGVtb1wiICYmIHtcclxuICAgICAgZW50cnk6IHJlc29sdmUoXHJcbiAgICAgICAgX19kaXJuYW1lLFxyXG4gICAgICAgIGBzcmMvanMvaW5kZXguJHtwcm9jZXNzLmVudi5idWlsZEZpbGUgPT09IFwidW1kXCIgPyBcInVtZFwiIDogXCJlc1wifS5qc2BcclxuICAgICAgKSxcclxuICAgICAgZm9ybWF0czogcHJvY2Vzcy5lbnYuYnVpbGRGaWxlID8gW1widW1kXCJdIDogW1wiZXNcIl0sXHJcbiAgICAgIG5hbWU6IFwidGVcIixcclxuICAgICAgZmlsZU5hbWU6IChmb3JtYXQpID0+IGB0dy1lbGVtZW50cy4ke2Zvcm1hdH0ubWluLmpzYCxcclxuICAgIH0sXHJcbiAgICByb2xsdXBPcHRpb25zOiB7XHJcbiAgICAgIGlucHV0OiBwcm9jZXNzLmVudi5tb2RlID09PSBcImRlbW9cIiAmJiB7XHJcbiAgICAgICAgaW5kZXg6IFwiaW5kZXguaHRtbFwiLFxyXG4gICAgICAgIC4uLk9iamVjdC5mcm9tRW50cmllcyhcclxuICAgICAgICAgIGdsb2JcclxuICAgICAgICAgICAgLnN5bmMoXCJkZW1vLyoqLyouaHRtbFwiKVxyXG4gICAgICAgICAgICAubWFwKChmaWxlKSA9PiBbXHJcbiAgICAgICAgICAgICAgcGF0aC5yZWxhdGl2ZShcclxuICAgICAgICAgICAgICAgIFwiZGVtb1wiLFxyXG4gICAgICAgICAgICAgICAgZmlsZS5zbGljZSgwLCBmaWxlLmxlbmd0aCAtIHBhdGguZXh0bmFtZShmaWxlKS5sZW5ndGgpXHJcbiAgICAgICAgICAgICAgKSxcclxuICAgICAgICAgICAgICBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoZmlsZSwgaW1wb3J0Lm1ldGEudXJsKSksXHJcbiAgICAgICAgICAgIF0pXHJcbiAgICAgICAgKSxcclxuICAgICAgfSxcclxuICAgICAgb3V0cHV0OiB7XHJcbiAgICAgICAgZGlyOiBcImRpc3QvanNcIixcclxuICAgICAgICBjaHVua0ZpbGVOYW1lczogKHsgbmFtZSB9KSA9PiB7XHJcbiAgICAgICAgICBjb25zdCBvbWl0UGhyYXNlID0gW1wiLnVtZFwiLCBcIi5lc21cIiwgXCIuZXNcIl07XHJcbiAgICAgICAgICBvbWl0UGhyYXNlLmZvckVhY2goKG9taXQpID0+IChuYW1lID0gbmFtZS5yZXBsYWNlKG9taXQsIFwiXCIpKSk7XHJcbiAgICAgICAgICByZXR1cm4gYCR7bmFtZX0uW2Zvcm1hdF0uanNgO1xyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAgc291cmNlbWFwOiB0cnVlLFxyXG4gIH0sXHJcbn0pO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXVSLFNBQVMsb0JBQW9CO0FBQ3BULFNBQVMsZUFBZTtBQUN4QixPQUFPLFVBQVU7QUFDakIsT0FBTyxVQUFVO0FBQ2pCLFNBQVMscUJBQXFCO0FBSjlCLElBQU0sbUNBQW1DO0FBQW9JLElBQU0sMkNBQTJDO0FBTTlOLElBQU0sV0FBVyxRQUFRLElBQUksU0FBUyxTQUFTLGdCQUFnQjtBQUcvRCxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixNQUFNO0FBQUEsRUFDTixRQUFRO0FBQUE7QUFBQSxJQUVOLGVBQWUsQ0FBQztBQUFBLEVBQ2xCO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxRQUFRO0FBQUEsSUFDUixhQUFhLFFBQVEsSUFBSSxZQUFZLFFBQVE7QUFBQSxJQUM3QyxLQUFLLFFBQVEsSUFBSSxTQUFTLFVBQVU7QUFBQSxNQUNsQyxPQUFPO0FBQUEsUUFDTDtBQUFBLFFBQ0EsZ0JBQWdCLFFBQVEsSUFBSSxjQUFjLFFBQVEsUUFBUTtBQUFBLE1BQzVEO0FBQUEsTUFDQSxTQUFTLFFBQVEsSUFBSSxZQUFZLENBQUMsS0FBSyxJQUFJLENBQUMsSUFBSTtBQUFBLE1BQ2hELE1BQU07QUFBQSxNQUNOLFVBQVUsQ0FBQyxXQUFXLGVBQWU7QUFBQSxJQUN2QztBQUFBLElBQ0EsZUFBZTtBQUFBLE1BQ2IsT0FBTyxRQUFRLElBQUksU0FBUyxVQUFVO0FBQUEsUUFDcEMsT0FBTztBQUFBLFFBQ1AsR0FBRyxPQUFPO0FBQUEsVUFDUixLQUNHLEtBQUssZ0JBQWdCLEVBQ3JCLElBQUksQ0FBQyxTQUFTO0FBQUEsWUFDYixLQUFLO0FBQUEsY0FDSDtBQUFBLGNBQ0EsS0FBSyxNQUFNLEdBQUcsS0FBSyxTQUFTLEtBQUssUUFBUSxJQUFJLEVBQUUsTUFBTTtBQUFBLFlBQ3ZEO0FBQUEsWUFDQSxjQUFjLElBQUksSUFBSSxNQUFNLHdDQUFlLENBQUM7QUFBQSxVQUM5QyxDQUFDO0FBQUEsUUFDTDtBQUFBLE1BQ0Y7QUFBQSxNQUNBLFFBQVE7QUFBQSxRQUNOLEtBQUs7QUFBQSxRQUNMLGdCQUFnQixDQUFDLEVBQUUsS0FBSyxNQUFNO0FBQzVCLGdCQUFNLGFBQWEsQ0FBQyxRQUFRLFFBQVEsS0FBSztBQUN6QyxxQkFBVyxRQUFRLENBQUMsU0FBVSxPQUFPLEtBQUssUUFBUSxNQUFNLEVBQUUsQ0FBRTtBQUM1RCxpQkFBTyxHQUFHO0FBQUEsUUFDWjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsSUFDQSxXQUFXO0FBQUEsRUFDYjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
