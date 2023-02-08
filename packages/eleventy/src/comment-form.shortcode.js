const nodeFetch = require("node-fetch");
const { logError, markupFetcher } = require("@jam-comments/server-utilities");

const CLIENT_SCRIPT_URL =
  "https://unpkg.com/@jam-comments/client@2.0.0-beta.2/dist/index.umd.js";

const fetchMarkup = markupFetcher("eleventy", nodeFetch);

const fetchCommentData = async ({ path, domain, apiKey }) => {
  try {
    return await fetchMarkup({
      path,
      domain,
      apiKey,
      embedScript: true,
    });
  } catch (e) {
    logError(e);
    return null;
  }
};

/**
 * Render the comment form.
 *
 * @param {object} options
 */
const commentForm = async function (options, path) {
  const { domain, apiKey } = options;
  const markup = await fetchCommentData({
    path,
    domain,
    apiKey,
  });

  return `
    ${markup}
    <script src="${CLIENT_SCRIPT_URL}"></script>
    <script>
      window.JamComments.initialize();
    </script>
  `;
};

module.exports = commentForm;
