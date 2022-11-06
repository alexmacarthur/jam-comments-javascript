import * as React from "react";
import { useEffect } from "react";
import { initialize } from "@jam-comments/client";
import { markupFetcher } from "@jam-comments/server-utilities";

export const JamComments = ({ markup }) => {
    const rootRef = React.useRef(null);
    
    useEffect(() => {
        if(!rootRef.current) return;
        console.log("Initializing JamComments...", rootRef.current.querySelector('.jc-Shell'));

        initialize(rootRef.current.querySelector('.jc-Shell'));
    }, [rootRef.current]);

  return <div ref={rootRef} dangerouslySetInnerHTML={{__html: markup }}></div>
}

export const fetchMarkup = markupFetcher("next");
