const isDev = () => {
  const processIsDefined = typeof process !== "undefined";
  let env = processIsDefined && process.env && process.env.NODE_ENV;

  if (!env) {
    env = "development";
    console.error(
      "A NODE_ENV environment variable is not set. Falling back to `development`."
    );
  }

  return env.toLowerCase() !== "production";
};

module.exports = isDev;
