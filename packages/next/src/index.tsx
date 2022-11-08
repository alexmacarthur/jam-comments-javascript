import * as React from "react";
import { markupFetcher } from "@jam-comments/server-utilities";

export const JamComments = ({ markup }) => {
  return <div dangerouslySetInnerHTML={{__html: markup }}></div>
}

export const fetchMarkup = markupFetcher("next");
