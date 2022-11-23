import { defineConfig } from "vite";
import path from "path";
import {
  baseRollupOptions,
  baseViteBuildOptions,
} from "../../shared-build-config";

export default defineConfig({
  build: {
    ...baseViteBuildOptions,
    lib: {
      entry: path.resolve(__dirname, "src/index.tsx"),
      name: "JamComments",
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      ...baseRollupOptions,
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
});
