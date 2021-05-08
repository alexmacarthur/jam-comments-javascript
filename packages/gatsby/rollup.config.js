const pkg = require("./package.json");
import path from "path";
import babel from "rollup-plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import postcss from "rollup-plugin-postcss";
import replace from "@rollup/plugin-replace";
import { terser } from "rollup-plugin-terser";
import { nodeResolve } from "@rollup/plugin-node-resolve";

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
  "react-dom": "ReactDOM",
};

const OUTPUT_DATA = [
  {
    file: pkg.module,
    format: "umd",
  },
  // {
  //   file: pkg.module,
  //   format: "es"
  // }
];

let plugins = [
  replace({
    preventAssignment: true,
    "process.env.JAM_COMMENTS_SERVICE_ENDPOINT": JSON.stringify(
      process.env.JAM_COMMENTS_SERVICE_ENDPOINT
    ),
  }),
  nodeResolve(),
  commonjs({
    exclude: "src/**",
  }),
  postcss({
    plugins: [],
  }),
  babel({
    configFile: path.resolve(__dirname, "babel.config.js"),
    exclude: "node_modules/*",
  }),
];

if (isProduction) {
  plugins = [
    ...plugins,
    terser({
      output: {
        preamble: banner,
      },
    }),
  ];
}

export default OUTPUT_DATA.map(({ file, format }) => ({
  input: "./src/JamComments.js",
  output: {
    file,
    format,
    name: "JamComments",
    globals,
  },
  plugins,
  external: [...Object.keys(pkg.peerDependencies || {})],
}));
