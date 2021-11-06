import { defineConfig } from "vite";
import path from "path";

const SCOPES = {
  client: {
    build: {
      lib: {
        entry: path.resolve(__dirname, `client/index.ts`),
        name: "JamComments",
        fileName: (format) => `index.${format}.js`,
      },
      rollupOptions: {
        output: {
          dir: "dist-client",
        },
      },
    },
  },
  server: {
    build: {
      target: "node14",
      lib: {
        entry: path.resolve(__dirname, `server/index.ts`),
        name: "JamComments",
        fileName: (format) => `index.${format}.js`,
      },
      rollupOptions: {
        output: {
          dir: "dist-server",
        },
      },
    },
  },
  shared: {
    build: {
      lib: {
        entry: path.resolve(__dirname, `shared/index.ts`),
        name: "JamComments",
        fileName: (format) => `index.${format}.js`,
      },
      rollupOptions: {
        output: {
          dir: "dist-shared",
        },
      },
    },
  },
};

export default defineConfig(SCOPES[process.env.BUILD_SCOPE]);
