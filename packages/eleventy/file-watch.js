#!/usr/bin/env node

const touch = require("touch");
const path = require("path");
const chokidar = require("chokidar");

chokidar.watch(".").on("change", () => {
  touch(path.join(__dirname, "../.eleventy.js"));
});

console.log("Watching...");
