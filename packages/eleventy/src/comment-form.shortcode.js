require("isomorphic-fetch");
const {
  logError,
  markupFetcher,
} = require("@jam-comments/server-utilities");

const fetchMarkup = markupFetcher("eleventy");

const fetchCommentData = async ({ path, domain, apiKey }) => {
  try {
    return await fetchMarkup({
      path, domain, apiKey, embedScript: true
    });
  } catch(e) {
    logError(e);
    return null;
  }
}

/**
 * Render the comment form.
 *
 * @param {object} options
 */
const commentForm = function (options, path) {
  const { domain, apiKey } = options;

  return fetchCommentData({
    path, 
    domain,
    apiKey
  });
};

module.exports = commentForm;
