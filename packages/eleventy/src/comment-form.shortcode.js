const path = require("path");
const nunjucks = require("nunjucks");
const {
  toIsoString,
  toPrettyDate,
  getCompiledAsset,
  getFileContents,
  setEnvironmentVariables,
} = require("./utils");

const {
  CommentFetcher,
  utilities: { filterByUrl },
} = require("jam-comments-utilities/server");
const env = nunjucks.configure(path.join(__dirname, "views"));

/**
 * Render the comment form.
 *
 * @param {object} options
 */
const commentForm = async function (options, url) {
  const fetcher = new CommentFetcher(options);
  const comments = await fetcher.getAllComments();
  const { domain, apiKey } = options;
  const loadingSvg = getFileContents(`assets/img/loading.svg`);
  const css = getCompiledAsset("css");
  const js = setEnvironmentVariables(getCompiledAsset("js"), domain, apiKey);

  env.addFilter("iso", (time) => {
    return toIsoString(time);
  });

  env.addFilter("prettyDate", (time) => {
    return toPrettyDate(time);
  });

  return env.render("index.njk", {
    comments: filterByUrl(comments, url),
    css,
    js,
    loadingSvg,
    domain,
    apiKey,
    url,
  });
};

module.exports = commentForm;
