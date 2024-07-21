import React from "react";

export const JamComments = ({ markup }) => {
  function initializeComments() {
    const el = document.getElementById("jcComments");

    function reAppendMarkup(element, markup) {
      const range = document.createRange();
      range.selectNode(element);
      const documentFragment = range.createContextualFragment(markup);
      element.innerHTML = "";
      element.append(documentFragment);
    }

    if (!el) {
      return;
    }

    if (!window.jcAlpine?.version) {
      reAppendMarkup(el, markup);
    }

    window.jcAlpine?.start();
  }

  if (typeof window !== "undefined") {
    setTimeout(initializeComments, 0);
  }

  return <div dangerouslySetInnerHTML={{ __html: markup }}></div>;
};
