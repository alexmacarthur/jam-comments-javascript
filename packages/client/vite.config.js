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
    setupFiles: ["./src/setupTests.ts"],
  },
  define: {
    "process.env.NODE_ENV": `"${process.env.NODE_ENV}"`,
  },
  build: {
    ...baseViteBuildOptions,
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
