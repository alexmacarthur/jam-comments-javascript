const { logError, markupFetcher } = require("@jam-comments/server-utilities");

const fetchMarkup = markupFetcher("eleventy");

const fetchCommentData = async ({
  path,
  domain,
  apiKey,
  schema,
  environment,
  tz,
}) => {
  try {
    return await fetchMarkup({
      path,
      domain,
      schema,
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
const commentForm = async function (options, path, schema) {
  const { domain, apiKey, environment, tz } = options;
  const markup = await fetchCommentData({
    path,
    domain,
    apiKey,
    schema,
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
