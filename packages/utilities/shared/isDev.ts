const isDev = (): boolean => {
  const processIsDefined = typeof process !== "undefined";
  const env =
    processIsDefined &&
    process.env &&
    process.env.NODE_ENV &&
    process.env.NODE_ENV.toLowerCase();

  return env !== "production";
};

export default isDev;
