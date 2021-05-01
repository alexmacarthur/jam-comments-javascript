const pkg = require("./package.json");
import babel from "@rollup/plugin-babel";
import typescript from "@rollup/plugin-typescript";
import { terser } from "rollup-plugin-terser";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import postcss from "rollup-plugin-postcss";
import reactSvg from "rollup-plugin-react-svg";
import replace from "@rollup/plugin-replace";

const isProduction = process.env.NODE_ENV === "production";

const globals = {
  react: "React",
  "react-dom": "ReactDOM",
};

const OUTPUT_DATA = [
  {
    file: pkg.main,
    format: "umd",
  },
  {
    file: pkg.module,
    format: "es",
  },
];

export default OUTPUT_DATA.map(({ file, format }) => {
  const plugins = [
    replace({
      preventAssignment: true,
      "process.env.JAM_COMMENTS_SERVICE_ENDPOINT": JSON.stringify(
        process.env.JAM_COMMENTS_SERVICE_ENDPOINT
      ),
    }),
    typescript(),
    commonjs(),
    resolve(),
    babel({
      exclude: "node_modules/*",
      presets: [
        [
          "@babel/preset-env",
          {
            modules: false,
            targets:
              format === "es"
                ? { esmodules: true }
                : {
                    browsers: [
                      "> 2%",
                      "Last 2 versions",
                      "safari >=9",
                      "not ie < 11",
                    ],
                  },
          },
        ],
        "@babel/preset-react",
        "@babel/preset-typescript",
      ],
    }),
    postcss({
      extract: false,
      plugins: [],
    }),
    reactSvg({
      svgo: {
        plugins: [],
        multipass: true,
      },
      jsx: false,
      include: null,
      exclude: null,
    }),
  ];

  if (isProduction) {
    plugins.push(terser());
  }

  return {
    input: "./src/index.tsx",
    output: {
      file,
      format,
      name: "JamComments",
      globals,
    },
    plugins,
    external: [...Object.keys(pkg.peerDependencies || {})],
  };
});
