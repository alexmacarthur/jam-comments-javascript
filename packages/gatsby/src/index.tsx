import React from "react";
import JamCommentsReact from "@jam-comments/react";
import styles from "@jam-comments/styles";

const JamComments = ({ pageContext, apiKey, domain }) => {
  console.log('pageContext right here!!!!');
  
  const initialComments =
    pageContext && pageContext.comments ? pageContext.comments : [];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles.replace(/\n|\r/g, "") }}></style>

      <JamCommentsReact
        platform={"gatsby"}
        initialComments={initialComments}
        apiKey={apiKey}
        domain={domain}
      />
    </>
  );
};

export default JamComments;
