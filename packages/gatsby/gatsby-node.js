require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`
});

const log = require("jam-comments-utilities/shared/log");
const {
  CommentFetcher,
  utilities: { filterByUrl }
} = require("jam-comments-utilities/server");

exports.sourceNodes = async (
  { actions, cache, createContentDigest },
  configOptions
) => {
  const { api_key: apiKey, domain } = configOptions;
  const { createNode } = actions;

  // Needed for client-side code.
  process.env.GATSBY_JAM_COMMENTS_API_KEY = apiKey;
  process.env.GATSBY_JAM_COMMENTS_DOMAIN = domain;

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
          contentDigest: createContentDigest(comment.content)
        }
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
  const comments = cachedComments ? filterByUrl(cachedComments, page.path) : [];

  if (!comments.length) {
    return;
  }

  deletePage(page);

  createPage({
    ...page,
    context: {
      ...page.context,
      comments
    }
  });
};
