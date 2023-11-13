const nodeFetch = require("node-fetch");
const { logError, markupFetcher } = require("@jam-comments/server-utilities");

const fetchMarkup = markupFetcher("eleventy", nodeFetch);

const fetchCommentData = async ({ path, domain, apiKey, environment, tz }) => {
  try {
    return await fetchMarkup({
      path,
      domain,
      apiKey,
      environment,
      tz,
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
  const { domain, apiKey, environment, tz } = options;
  const markup = await fetchCommentData({
    path,
    domain,
    apiKey,
    environment,
    tz,
  });

  return `
    ${markup}
    <script>
      window.jcAlpine.start();
    </script>
  `;
};

module.exports = commentForm;
