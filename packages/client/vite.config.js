import * as dotenv from "dotenv";
import { defineConfig } from "vite";
import path from "path";
import {
  baseRollupOptions,
  baseViteBuildOptions,
} from "../../shared-build-config";
import { proxyPage } from "vite-plugin-proxy-page";

dotenv.config();

export default defineConfig({
  plugins: [
    proxyPage({
      remoteUrl: process.env.REMOTE_URL,
      localEntryPoint: "./index.ts",
      remoteEntryPoint: "resources/js/markup-scripts.ts",
    }),
  ],
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
