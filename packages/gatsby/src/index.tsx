import React, { ReactElement, useEffect } from "react";

interface JamCommentsProps {
  pageContext: {
    [key: string]: any;
  };
}

declare global {
  interface Window {
    JamComments: {
      initialize: () => void;
    };
  }
}

const CLIENT_SCRIPT_URL =
  "https://unpkg.com/@jam-comments/client@2.0.0-beta.2/dist/index.umd.js";

const createScriptTagWithSource = (source: string) => {
  const script = document.createElement("script");
  script.src = source;

  return script;
};

const JamComments = ({ pageContext }: JamCommentsProps): ReactElement => {
  const { markup } = pageContext.jamComments;

  useEffect(() => {
    if (typeof window === "undefined") return;

    const script = createScriptTagWithSource(CLIENT_SCRIPT_URL);
    script.onload = () => window.JamComments.initialize();

    document.body.appendChild(script);
  }, []);

  return <div dangerouslySetInnerHTML={{ __html: markup }}></div>;
};

export default JamComments;
