import React, { ReactElement } from "react";
import JamCommentsReact from "@jam-comments/react";
import styles from "@jam-comments/styles";

interface JamCommentsProps {
  pageContext: {
    [key: string]: any;
  };
  apiKey: string;
  domain: string;
}

const JamComments = ({
  pageContext,
  apiKey,
  domain,
}: JamCommentsProps): ReactElement => {
  const initialComments =
    pageContext && pageContext.comments ? pageContext.comments : [];

  return (
    <>
      <style
        dangerouslySetInnerHTML={{ __html: styles.replace(/\n|\r/g, "") }}
      ></style>

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
