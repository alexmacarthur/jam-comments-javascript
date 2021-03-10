const DEFAULT_SERVICE_ENDPOINT = "https://service.jamcomments.com";

const getServiceEndpoint = (endpoint) => {
  const processIsDefined = typeof process !== "undefined";
  const ENVIRONMENT_SERVICE_ENDPOINT =
    processIsDefined &&
    process.env &&
    process.env.JAM_COMMENTS_SERVICE_ENDPOINT;

  return endpoint || ENVIRONMENT_SERVICE_ENDPOINT || DEFAULT_SERVICE_ENDPOINT;
};

module.exports = getServiceEndpoint;
