import * as React from "react";
import { markupFetcher } from "@jam-comments/server-utilities";
const { useEffect } = React;
const CLIENT_SCRIPT_URL =
  "https://unpkg.com/@jam-comments/client@2.1.6/dist/index.umd.js";
const SCRIPT_ID = "jam-comments-script";

const createScriptTagWithSource = (source: string) => {
  const script = document.createElement("script");
  script.id = SCRIPT_ID;
  script.src = source;

  return script;
};

export const JamComments = ({ markup }) => {
  useEffect(() => {
    if (typeof document === "undefined") return;

    const script = createScriptTagWithSource(CLIENT_SCRIPT_URL);
    script.onload = () => window.JamComments.initialize();

    const existingScript = document.getElementById(SCRIPT_ID);
    if (existingScript) existingScript.remove();

    document.body.appendChild(script);
  }, []);

  return <div dangerouslySetInnerHTML={{ __html: markup }}></div>;
};

export const fetchMarkup = markupFetcher("remix");
