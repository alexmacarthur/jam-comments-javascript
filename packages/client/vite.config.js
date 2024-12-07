import * as dotenv from "dotenv";
import { defineConfig } from "vite";
import path from "path";
import {
  baseRollupOptions,
  baseViteBuildOptions,
} from "../../shared-build-config";

dotenv.config();

export default defineConfig({
  test: {
    environment: "happy-dom",
  },
  define: {
    "process.env.NODE_ENV": `"${process.env.NODE_ENV}"`,
  },
  build: {
    ...baseViteBuildOptions,
    lib: {
      entry: [
        path.resolve(__dirname, "src/index.ts"),
        path.resolve(__dirname, "src/component.ts"),
      ],
      name: "JamComments",
      fileName: (format, entryName) => {
        if (entryName === "component") {
          return `component/index.js`;
        }

        return `${entryName}.${format}.js`;
      },
    },
    rollupOptions: {
      ...baseRollupOptions,
    },
  },
});
