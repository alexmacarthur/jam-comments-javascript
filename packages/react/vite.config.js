import { defineConfig } from "vite";
import path from "path";
import postcss from 'rollup-plugin-postcss'
import reactSvg from 'rollup-plugin-react-svg';

export default defineConfig({
  plugins: [
    reactSvg({
      svgo: {
        plugins: [],
        multipass: true,
      },
      jsx: false,
      include: null,
      exclude: null
    }),
    postcss({
      extract: true
    })
  ],
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
