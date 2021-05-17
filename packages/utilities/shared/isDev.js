const isDev = () => {
  const processIsDefined = typeof process !== "undefined";
  const env =
    processIsDefined && process.env && process.env.NODE_ENV.toLowerCase();

  return env !== "production";
};

module.exports = isDev;
