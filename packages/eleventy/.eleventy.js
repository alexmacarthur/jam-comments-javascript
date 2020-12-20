const commentForm = require("./src/comment-form.shortcode");

module.exports = function (eleventyConfig, options) {
  options = options || {};

  const renderCommentForm = async function (url = null) {
    url = url || (this.page && this.page.url) || null;

    if (!url) {
      throw new Error("JamComments :: No URL was found or passed!");
    }

    return await commentForm(options, url);
  };

  eleventyConfig.addNunjucksAsyncShortcode("jamcomments", renderCommentForm);
  eleventyConfig.addLiquidShortcode("jamcomments", renderCommentForm);
  eleventyConfig.addJavaScriptFunction("jamcomments", renderCommentForm);
};
