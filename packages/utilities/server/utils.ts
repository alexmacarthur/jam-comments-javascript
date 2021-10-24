const URL = require("url");

export const parsePath = (urlOrPath) => {
  return URL.parse(urlOrPath).pathname.replace(/^\/|\/$/g, "");
};

/**
 * Filter out the comments that don't belong to a certain URL.
 *
 * @param {array} comments
 * @param {string} url
 */
export const filterByUrl = (comments, urlOrPath) => {
  const pagePath = parsePath(urlOrPath);

  return comments.filter((comment) => {
    if (!comment.path) {
      return false;
    }

    const commentPath = parsePath(comment.path);

    return commentPath === pagePath;
  });
};
