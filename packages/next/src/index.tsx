import * as React from "react";
import { markupFetcher } from "@jam-comments/server-utilities";

const { useRef, useEffect } = React;

export const JamComments = ({ markup }) => {
  const elRef = useRef<HTMLDivElement>();
  const hasFiredRef = useRef<boolean>(false);

  useEffect(() => {
    if (hasFiredRef.current) return;
    if (!elRef.current) return;

    if (!window.jcAlpine.version) {
      const range = document.createRange();
      range.selectNode(elRef.current);
      const documentFragment = range.createContextualFragment(markup);

      elRef.current.innerHTML = "";
      elRef.current.append(documentFragment);
    }

    setTimeout(() => {
      window.jcAlpine.start();
    });

    hasFiredRef.current = true;
  }, []);

  return <div ref={elRef} dangerouslySetInnerHTML={{ __html: markup }}></div>;
};

export const fetchMarkup = markupFetcher("next");
