import * as React from "react";
import { useRef } from "react";

declare global {
  interface Window {
    jcAlpine: any;
  }
}

const canUseDOM = !!(
  typeof window !== "undefined" &&
  window.document &&
  window.document.createElement
);

const useLayoutEffect = canUseDOM ? React.useLayoutEffect : () => {};

export const JamComments = ({ markup }) => {
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
