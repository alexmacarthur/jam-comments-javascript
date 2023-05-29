const nodeFetch = require("node-fetch");
const { logError, markupFetcher } = require("@jam-comments/server-utilities");

const fetchMarkup = markupFetcher("gatsby", nodeFetch);
const JAM_COMMENTS_CONFIG = {};

exports.onPreInit = (_, pluginOptions) => {
  JAM_COMMENTS_CONFIG.apiKey = pluginOptions.apiKey;
  JAM_COMMENTS_CONFIG.domain = pluginOptions.domain;
  JAM_COMMENTS_CONFIG.environment = pluginOptions.environment;
  JAM_COMMENTS_CONFIG.tz = pluginOptions.tz;
};

const fetchCommentData = async (pagePath) => {
  try {
    return await fetchMarkup({
      path: pagePath,
      domain: JAM_COMMENTS_CONFIG.domain,
      apiKey: JAM_COMMENTS_CONFIG.apiKey,
      environment: JAM_COMMENTS_CONFIG.environment,
      tz: JAM_COMMENTS_CONFIG.tz,
    });
  } catch (e) {
    logError(e);
    return null;
  }
};

/**
 * When each page is created, attach any of its comments to page context.
 */
exports.onCreatePage = async ({ page, actions }) => {
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
