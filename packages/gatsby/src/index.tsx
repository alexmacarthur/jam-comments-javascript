import React, { ReactElement, useEffect, useRef } from "react";

interface JamCommentsProps {
  pageContext: {
    [key: string]: any;
  };
}

declare global {
  interface Window {
    JamComments: {
      initialize: () => void;
      isInitialized: boolean;
    };
    jcAlpine: any;
  }
}

const JamComments = ({ pageContext }: JamCommentsProps): ReactElement => {
  const { markup } = pageContext.jamComments;
  const elRef = useRef<HTMLDivElement>();
  const hasFiredRef = useRef<boolean>(false);

  useEffect(() => {
    if (hasFiredRef.current) return;
    if (!elRef.current) return;

    if (!window.jcAlpine?.version) {
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

export default JamComments;
