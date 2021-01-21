import React from "react";
import JamComments from "@jam-comments/react";

export default ({ pageContext, apiKey, domain }) => {
  const initialComments =
    pageContext && pageContext.comments ? pageContext.comments : [];

  return (
    <JamComments
      initialComments={initialComments}
      apiKey={apiKey}
      domain={domain}
    />
  );
};
