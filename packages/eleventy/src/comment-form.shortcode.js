const {
  logError,
  markupFetcher,
  removeFalseyValues,
} = require("@jam-comments/server-utilities");

const fetchMarkup = markupFetcher("eleventy");

const fetchCommentData = async ({
  copy,
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
      copy: removeFalseyValues({
        copy_confirmation_message: copy.confirmationMessage,
        copy_submit_button: copy.submitButton,
        copy_name_placeholder: copy.namePlaceholder,
        copy_email_placeholder: copy.emailPlaceholder,
        copy_comment_placeholder: copy.commentPlaceholder,
        copy_write_tab: copy.writeTab,
        copy_preview_tab: copy.previewTab,
        copy_auth_button: copy.authButton,
        copy_log_out_button: copy.logOutButton,
      }),
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
  const { domain, apiKey, environment, tz, copy } = options;
  const markup = await fetchCommentData({
    tz,
    copy,
    path,
    domain,
    apiKey,
    schema,
    environment,
  });

  return `
    ${markup}
    <script>
      window.jcAlpine.start();
    </script>
  `;
};

module.exports = commentForm;
