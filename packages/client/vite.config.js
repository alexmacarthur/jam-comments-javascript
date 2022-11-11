import { defineConfig } from "vite";
import path from "path";
import { baseRollupOptions } from "../../shared-build-config";
import { proxyPage } from "vite-plugin-proxy-page";

export default defineConfig({
  plugins: [
    proxyPage({
      remoteUrl: "http://localhost/markup?domain=macarthur.me&path=/posts/dynamic-routing&ignore_auth=true&key=3|MEk155tEtoEQgrAK3c5ssMKeINX1hbWaAsEVUvhJ", 
      localEntryPoint: "./index.ts",
      remoteEntryPoint: "resources/js/markup-scripts.ts"
    })
  ],
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
