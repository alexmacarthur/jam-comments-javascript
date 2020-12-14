const pkg = require("./package.json");
import path from "path";
import babel from "rollup-plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import postcss from "rollup-plugin-postcss";
import scss from "rollup-plugin-scss";
import { terser } from "rollup-plugin-terser";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import reactSvg from "rollup-plugin-react-svg";

const isProduction = process.env.NODE_ENV === "production";

const banner = `/**
  *
  * JamComments
  * Author: ${pkg.author}
  * Version: v${pkg.version}
  * License: ${pkg.license}
  * URL: ${pkg.homepage}
  *
  */`;

const globals = {
  react: "React",
  "react-dom": "ReactDOM"
};

const OUTPUT_DATA = [
  {
    file: pkg.module,
    format: "umd"
  }
];

let plugins = [
  scss(),
  nodeResolve(),
  commonjs({
    // include: 'node_modules/**'
    exclude: "src/ui/**"
  }),
  postcss({
    plugins: []
  }),
  babel({
    configFile: path.resolve(__dirname, "babel.config.js"),
    exclude: "node_modules/*"
  }),
  reactSvg({
    svgo: {
      plugins: [],
      multipass: true
    },
    jsx: false,
    include: null,
    exclude: null
  })
];

if (isProduction) {
  plugins = [
    ...plugins,
    terser({
      output: {
        preamble: banner
      }
    })
  ];
}

export default OUTPUT_DATA.map(({ file, format }) => ({
  input: "./src/ui/Shell/index.js",
  output: {
    file,
    format,
    name: "JamComments",
    globals
  },
  plugins,
  external: [...Object.keys(pkg.peerDependencies || {})]
}));
