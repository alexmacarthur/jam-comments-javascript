import nodeFetch from "node-fetch";
import {
  logError,
  markupFetcher,
  removeFalseyValues,
} from "@jam-comments/server-utilities";

const fetchMarkup = markupFetcher("gatsby", nodeFetch);
const JAM_COMMENTS_CONFIG = {};

export const onPreInit = (_, pluginOptions) => {
  JAM_COMMENTS_CONFIG.tz = pluginOptions.tz;
  JAM_COMMENTS_CONFIG.copy = pluginOptions.copy;
  JAM_COMMENTS_CONFIG.domain = pluginOptions.domain;
  JAM_COMMENTS_CONFIG.apiKey = pluginOptions.apiKey;
  JAM_COMMENTS_CONFIG.environment = pluginOptions.environment;
};

const fetchCommentData = async (pagePath) => {
  const copy = JAM_COMMENTS_CONFIG.copy;

  try {
    return await fetchMarkup({
      path: pagePath,
      tz: JAM_COMMENTS_CONFIG.tz,
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
      domain: JAM_COMMENTS_CONFIG.domain,
      apiKey: JAM_COMMENTS_CONFIG.apiKey,
      environment: JAM_COMMENTS_CONFIG.environment,
    });
  } catch (e) {
    logError(e);
    return null;
  }
};

/**
 * When each page is created, attach any of its comments to page context.
 */
export const onCreatePage = async ({ page, actions }) => {
  const { createPage, deletePage } = actions;
  const pagePath = page.path.replace(/\/+$/, "") || "";
  const markup = await fetchCommentData(pagePath);

  deletePage(page);

  createPage({
    ...page,
    context: {
      ...page.context,
      jamComments: {
        markup,
      },
    },
  });
};
