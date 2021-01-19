import * as React from "react";
import JamCommentsReact from "@jam-comments/react/dist/index.es.js";
const { CommentFetcher } = require("@jam-comments/utilities/server");

export const JamComments = ({ comments }) => {
  return <JamCommentsReact initialComments={comments} />;
};

export const fetchByPath = async ({ apiKey, domain, path }) => {
  const fetcher = new CommentFetcher({
    domain,
    apiKey,
    requireFetchPolyfill: false,
  });

  return await fetcher.getAllComments(path);
};
