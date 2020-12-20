const SERVICE_ENDPOINT = "https://service.jamcomments.com";

const getServiceEndpoint = (endpoint) => {
  const ENVIRONMENT_SERVICE_ENDPOINT = process && process.env && process.env.JAM_COMMENTS_SERVICE_ENDPOINT;

  return (
    endpoint || ENVIRONMENT_SERVICE_ENDPOINT || SERVICE_ENDPOINT
  );
};

module.exports = getServiceEndpoint;
