import React from "react";

import JamComments from "@jam-comments/react";

export default ({ pageContext }) => {
  const initialComments =
    pageContext && pageContext.comments ? pageContext.comments : [];

  return (
    <>
      <JamComments initialComments={initialComments}/>
    </>
  )
};
