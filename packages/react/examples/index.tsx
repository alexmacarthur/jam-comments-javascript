import React from "react";
import ReactDOM from "react-dom";
import JamComments from "../src/index";

ReactDOM.render(
  <React.StrictMode>
    <JamComments
      platform="a-platform"
      initialComments={[]}
      domain="http://whatever.com"
      apiKey="abc123"
    />
  </React.StrictMode>,
  document.getElementById("app")
);
