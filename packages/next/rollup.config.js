const pkg = require("./package.json");
import typescript from "@rollup/plugin-typescript";
import { terser } from "rollup-plugin-terser";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

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

let plugins = [typescript(), commonjs(), resolve()];

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
