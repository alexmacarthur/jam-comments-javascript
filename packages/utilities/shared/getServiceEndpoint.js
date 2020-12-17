const SERVICE_ENDPOINT = "https://service.jamcomments.com";

const getServiceEndpoint = (endpoint) => {
  return (
    endpoint || process?.env?.JAM_COMMENTS_SERVICE_ENDPOINT || SERVICE_ENDPOINT
  );
};

module.exports = getServiceEndpoint;
