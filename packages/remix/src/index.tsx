import * as React from "react";
import JamCommentsReact from "@jam-comments/react";
import { CommentFetcher } from "@jam-comments/server-utilities";
import styles from "@jam-comments/styles";

export const JamComments = ({ comments, apiKey, domain }) => {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }}></style>

      <JamCommentsReact
        platform={"next"}
        initialComments={comments}
        apiKey={apiKey}
        domain={domain}
      />
    </>
  );
};

export const fetchByPath = async ({ apiKey, domain, path }) => {
  const fetcher = new CommentFetcher({
    domain,
    apiKey,
  });

  const comments = await fetcher.getAllComments(path);

  return comments;
};
