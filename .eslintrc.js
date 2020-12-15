module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: "plugin:react/recommended",
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
  },
  settings: {
    react: {
      version: "17.0",
    },
  },
  plugins: ["react", "@typescript-eslint"],
  rules: {
    "react/display-name": 0,
    "react/prop-types": 0,
  },
};
