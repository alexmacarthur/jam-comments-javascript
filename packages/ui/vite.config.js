import { defineConfig } from "vite";
import path from "path";
import { baseRollupOptions } from "../../shared-build-config";
import { proxyPage } from "vite-plugin-proxy-page";

export default defineConfig({
  plugins: [
    proxyPage({
      localEntryPoint: "./local-dev.ts",
      remoteUrl: "http://localhost/markup?path=/some-page-path&domain=example-one.com&ignore_auth=true&key=50|xa7Ua4tFX36NN10bztWel2R8vYZNkfqY4SyWIGDd", 
      cacheHtml: false,
      rootNode: {
        id: 'app'
      }
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
