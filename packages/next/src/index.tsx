import * as React from "react";
import JamCommentsReact from "@jam-comments/react/dist/index.es.js";
const { CommentFetcher } = require("@jam-comments/utilities/server");

export const JamComments = ({ comments, apiKey, domain }) => {
  return (
    <JamCommentsReact
      platform={"next"}
      initialComments={comments}
      apiKey={apiKey}
      domain={domain}
    />
  );
};

export const fetchByPath = async ({ apiKey, domain, path }) => {
  const fetcher = new CommentFetcher({
    domain,
    apiKey,
  });

  return await fetcher.getAllComments(path);
};
