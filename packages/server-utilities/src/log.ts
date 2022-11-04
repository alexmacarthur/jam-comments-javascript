import chalk from "chalk";

export const log = (message: string): void => {
  console.log(`${chalk.magenta("JamComments:")} ${message}`);
};

export const logError = (message: string): void => {
  console.error(`JamComments: ${message}`);
}
