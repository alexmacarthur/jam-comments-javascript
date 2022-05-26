import React from "react";
import ReactDOM from "react-dom";
import JamComments from "../src/index";
import styles from "@jam-comments/styles";

ReactDOM.render(
  <React.StrictMode>
    <style>{styles}</style>
    <JamComments
      platform="a-platform"
      initialComments={[
        {
          content: "Here is some content.",
          createdAt: "1641241000000",
          emailAddress: "test@email.com",
          id: "999",
          name: "Alex MacArthur",
          site: "9",
          isPending: false,
          children: [],
        },
      ]}
      domain="http://whatever.com"
      apiKey="abc123"
    />
  </React.StrictMode>,
  document.getElementById("app")
);
