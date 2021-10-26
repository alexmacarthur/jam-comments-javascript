import URL from "url-parse";

/**
 * Gets the path from a URL with no leading or trailing slashes.
 */
export const parsePath = (urlOrPath: string): string => {
  const pathName = (new URL(urlOrPath))['pathname'] || "";
  return pathName.replace(/^(\/{1,})|\/{1,}$/g, "");
};

/**
 * Filter out the comments that don't belong to a certain URL.
 */
export const filterByUrl = (comments: any[], urlOrPath: string): any[] => {
  const pagePath = parsePath(urlOrPath);

  return comments.filter((comment) => {
    if (!comment.path) {
      return false;
    }

    const commentPath = parsePath(comment.path);

    return commentPath === pagePath;
  });
};
