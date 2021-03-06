require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
});

require("isomorphic-fetch");
const log = require("@jam-comments/utilities/shared/log");
const isDev = require("@jam-comments/utilities/shared/isDev");
const {
  CommentFetcher,
  utilities: { filterByUrl },
} = require("@jam-comments/utilities/server");

exports.sourceNodes = async (
  { actions, cache, createContentDigest },
  configOptions
) => {
  const { api_key: apiKey, domain } = configOptions;
  const { createNode } = actions;

  const fetcher = new CommentFetcher({ domain, apiKey });
  const comments = await fetcher.getAllComments();

  log(`Fetched a total of ${comments.length} comments.`);

  for (let comment of comments) {
    const nodeData = Object.assign(
      { ...comment },
      {
        id: comment.id,
        parent: null,
        children: [],
        internal: {
          type: `JamComment`,
          mediaType: "text/plain",
          contentDigest: createContentDigest(comment.content),
        },
      }
    );

    createNode(nodeData);
  }

  await cache.set("jamComments", comments);
};

/**
 * When each page is created, attach any of its comments to page context.
 */
exports.onCreatePage = async ({ page, actions, cache }) => {
  const { createPage, deletePage } = actions;
  const cachedComments = await cache.get("jamComments");

  // Nothing in the cache! Don't bother.
  if (!cachedComments) {
    return;
  }

  // We're dealing with "dummy" comments, so just let them go.
  const comments = isDev()
    ? cachedComments
    : filterByUrl(cachedComments, page.path);

  // No comments for this post were found. We're done.
  if (!comments.length) {
    return;
  }

  deletePage(page);

  createPage({
    ...page,
    context: {
      ...page.context,
      comments,
    },
  });
};
