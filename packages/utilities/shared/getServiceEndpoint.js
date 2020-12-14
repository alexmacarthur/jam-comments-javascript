const SERVICE_ENDPOINT = "https://service.jamcomments.com";

const getServiceEndpoint = () => {
  return process?.env?.JAM_COMMENTS_SERVICE_ENDPOINT || SERVICE_ENDPOINT;
}

module.exports = getServiceEndpoint;
