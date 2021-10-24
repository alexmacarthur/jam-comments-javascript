const path = require("path");
const nunjucks = require("nunjucks");
const {
  toIsoString,
  toPrettyDate,
  getCompiledAsset,
  getFileContents,
  setEnvironmentVariables,
} = require("./utils");

require("isomorphic-fetch");
const {
  CommentFetcher,
  filterByUrl,
} = require("@jam-comments/utilities/server");
const {
  getServiceEndpoint,
  countComments,
  isDev,
} = require("@jam-comments/utilities/shared");
const env = nunjucks.configure(path.join(__dirname, "views"), {
  noCache: true,
});

/**
 * Render the comment form.
 *
 * @param {object} options
 */
const commentForm = async function (options, url) {
  const fetcher = new CommentFetcher(options);
  const comments = await fetcher.getAllComments();
  const filteredComments = filterByUrl(comments, url);
  const { domain, apiKey } = options;
  const loadingSvg = getFileContents(`assets/img/loading.svg`);
  const css = getCompiledAsset("style.css");
  const js = setEnvironmentVariables(
    getCompiledAsset("index.umd.js"),
    domain,
    apiKey
  );

  env.addFilter("iso", (time) => {
    return toIsoString(time);
  });

  env.addFilter("prettyDate", (time) => {
    return toPrettyDate(time);
  });

  env.addFilter("countComments", (comments) => {
    return countComments(comments);
  });

  return env.render("index.njk", {
    comments: isDev() ? comments : filteredComments,
    // comments: filteredComments,
    css,
    js,
    loadingSvg,
    domain,
    apiKey,
    url,
    apiKey,
    serviceEndpoint: `${getServiceEndpoint()}/graphql`,
  });
};

module.exports = commentForm;
