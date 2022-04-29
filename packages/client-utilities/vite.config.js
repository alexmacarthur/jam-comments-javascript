import { defineConfig } from "vite";
import path from "path";
import { baseRollupOptions } from "../../shared-build-config";

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "JamComments",
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      ...baseRollupOptions,
    },
  },
});
