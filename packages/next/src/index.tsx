import * as React from "react";
import { markupFetcher } from "@jam-comments/server-utilities";

const { useEffect } = React;

export const JamComments = ({ markup }) => {
  useEffect(() => {
    if (window.JamComments.isInitialized) return;

    function initJamComments() {
      window.JamComments.initialize();
      window.JamComments.isInitialized = true;
    }

    document.addEventListener("alpine:init", initJamComments);

    window.jcAlpine.start();

    return () => document.removeEventListener("alpine:init", initJamComments);
  }, []);

  return <div dangerouslySetInnerHTML={{ __html: markup }}></div>;
};

export const fetchMarkup = markupFetcher("next");
