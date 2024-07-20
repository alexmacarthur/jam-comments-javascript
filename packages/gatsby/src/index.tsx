import React, { ReactElement, useLayoutEffect, useRef } from "react";

interface JamCommentsProps {
  pageContext: {
    [key: string]: any;
  };
}

declare global {
  interface Window {
    jcAlpine: any;
  }
}

const JamComments = ({ pageContext }: JamCommentsProps): ReactElement => {
  const { markup } = pageContext.jamComments;
  const elRef = useRef<HTMLDivElement>();
  const hasFiredRef = useRef<boolean>(false);

  useLayoutEffect(() => {
    function reAppendMarkup(element: HTMLElement, markup: string) {
      const range = document.createRange();
      range.selectNode(element);
      const documentFragment = range.createContextualFragment(markup);

      element.innerHTML = "";
      element.append(documentFragment);
    }

    if (hasFiredRef.current) return;
    if (!elRef.current) return;
    if (!window.jcAlpine?.version) {
      reAppendMarkup(elRef.current, markup);
    }

    window.jcAlpine.start();

    hasFiredRef.current = true;
  }, []);

  return <div ref={elRef} dangerouslySetInnerHTML={{ __html: markup }}></div>;
};

export default JamComments;
