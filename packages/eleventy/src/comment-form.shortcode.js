const nodeFetch = require("node-fetch");
const { logError, markupFetcher } = require("@jam-comments/server-utilities");

const CLIENT_SCRIPT_URL =
  "https://unpkg.com/@jam-comments/client@1.0.4/dist/index.umd.js";

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
      const root = document.querySelector('[data-jam-comments-component="shell"]');
      JamComments.initialize(root);
    </script>
  `;
};

module.exports = commentForm;
