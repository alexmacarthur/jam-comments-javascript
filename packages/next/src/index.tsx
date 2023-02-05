import * as React from "react";
import { markupFetcher } from "@jam-comments/server-utilities";

const { useEffect } = React;
const CLIENT_SCRIPT_URL = "https://unpkg.com/@jam-comments/client@2.0.0-beta.2/dist/index.umd.js";
const createScriptTagWithSource = (source: string) => {
  const script = document.createElement("script");
  script.src = source;

  return script;
};

export const JamComments = ({ markup }) => {
  useEffect(() => {
      if(typeof window === "undefined") return;

      const script = createScriptTagWithSource(CLIENT_SCRIPT_URL);
      script.onload = () => window.JamComments.initialize();

      document.body.appendChild(script);
  }, []);

  return <div dangerouslySetInnerHTML={{__html: markup}}></div>
}

export const fetchMarkup = markupFetcher("next");
