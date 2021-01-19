const pkg = require("./package.json");
import babel from "@rollup/plugin-babel";
import typescript from "@rollup/plugin-typescript";
import { terser } from "rollup-plugin-terser";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import postcss from "rollup-plugin-postcss";
// import reactSvg from "rollup-plugin-react-svg";

const isProduction = process.env.NODE_ENV === "production";

const globals = {
  react: "React",
  "react-dom": "ReactDOM",
};

const OUTPUT_DATA = [
  {
    file: pkg.main,
    format: "es",
  },
];

let plugins = [
  typescript(),
  commonjs(),
  resolve(),
  // postcss({
  //   extract: false,
  //   plugins: [],
  // }),
];

if (isProduction) {
  plugins = [...plugins, terser()];
}

export default OUTPUT_DATA.map(({ file, format }) => ({
  input: "./src/index.tsx",
  output: {
    file,
    format,
    name: "JamComments",
    globals,
  },
  plugins,
  external: [...Object.keys(pkg.peerDependencies || {})],
}));
