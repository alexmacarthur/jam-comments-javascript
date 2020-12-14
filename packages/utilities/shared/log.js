const chalk = require("chalk");

const log = (message) => {
  console.log(`${chalk.magenta("JamComments:")} ${message}`);
};

module.exports = log;
