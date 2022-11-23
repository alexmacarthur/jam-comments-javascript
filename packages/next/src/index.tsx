import React, { useEffect, useRef } from "react";
import { markupFetcher } from "@jam-comments/server-utilities";
import { initialize } from "@jam-comments/client"

export const JamComments = ({ markup }) => {
  const rootRef = useRef();

  useEffect(() => {
    if(!rootRef.current) return;

    initialize((rootRef.current as unknown as HTMLElement).querySelector('.jc-Shell'));
  }, [rootRef.current]);

  return <div ref={rootRef} dangerouslySetInnerHTML={{__html: markup }}></div>
}

export const fetchMarkup = markupFetcher("next");
