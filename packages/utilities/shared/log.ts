import chalk from "chalk";

const log = (message):void => {
  console.log(`${chalk.magenta("JamComments:")} ${message}`);
};

export default log;
