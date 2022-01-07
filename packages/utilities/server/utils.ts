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

export const makeHtmlReady = (content: string): string => {
  if (/(^<[a-z]+>)(.*)(<\/[a-z]+>)$/.test(content)) {
    return content;
  }

  return content
    // break into pieces by line break
    .split(/(?:\r\n|\r|\n)/)

    // remove remaining empty items
    .filter(text => !!text)

    // trim and wrap in paragraph tags
    .map(text => `<p>${text.trim()}</p>`)

    // turn it back into a big chunk o' text
    .join('');
}
