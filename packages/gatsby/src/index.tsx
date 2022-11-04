import React, { ReactElement, useEffect, useRef } from "react";
import { initialize } from "@jam-comments/client"

interface JamCommentsProps {
  pageContext: {
    [key: string]: any;
  }
}

const JamComments = ({ pageContext }: JamCommentsProps): ReactElement => {
  const { markup } = pageContext.jamComments;
  const rootRef = useRef(null);

  useEffect(() => {
    if(!rootRef.current) return;

    initialize(rootRef.current.querySelector('.jc-Shell'));

  }, [rootRef.current]);

  return <div ref={rootRef} dangerouslySetInnerHTML={{__html: markup }}></div>
};

export default JamComments;
