import React from "react";
import ReactDOM from "react-dom";
import JamComments from "../src/index";
import styles from "@jam-comments/styles";

ReactDOM.render(
  <React.StrictMode>
    <style>{styles}</style>
    <JamComments
      platform="a-platform"
      initialComments={[]}
      domain="http://whatever.com"
      apiKey="abc123"
    />
  </React.StrictMode>,
  document.getElementById("app")
);
