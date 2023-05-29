const commentForm = require("./src/comment-form.shortcode");

module.exports = function (eleventyConfig, options) {
  options = options || {};

  const renderCommentForm = async function (path = null) {
    path = path || (this.page && this.page.url) || null;

    if (!path) {
      throw new Error("JamComments :: No path was found or passed!");
    }

    return await commentForm(options, path);
  };

  eleventyConfig.addNunjucksAsyncShortcode("jamcomments", renderCommentForm);
  eleventyConfig.addLiquidShortcode("jamcomments", renderCommentForm);
  eleventyConfig.addJavaScriptFunction("jamcomments", renderCommentForm);
};
