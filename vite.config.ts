import { PluginOption, defineConfig } from "vite";
import postcssLit from "rollup-plugin-postcss-lit";
import dts from "vite-plugin-dts";
import glob from "glob";
import { basename, dirname } from "path";
import { fileURLToPath } from "url";

export const plugins: PluginOption[] = [
  postcssLit({
    exclude: "**/*global.*",
  }),
];

export default defineConfig({
  plugins: [...plugins, dts({ rollupTypes: true })],
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: glob
        .sync("src/*/index.ts", {
          cwd: dirname(fileURLToPath(import.meta.url)),
        })
        .reduce(
          (current, next) =>
            Object.assign(current, { [basename(dirname(next))]: next }),
          {} as Record<string, string>
        ),
      formats: ["es"],
    },
    minify: false,
  },
});
