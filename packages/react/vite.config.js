import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  build: {
    cssCodeSplit: false,
    lib: {
      entry: path.resolve(__dirname, "src/index.tsx"),
      name: "JamComments",
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
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
