import * as React from "react";
import { markupFetcher } from "@jam-comments/client-utilities";

export const JamComments = ({ markup }) => <div dangerouslySetInnerHTML={{__html: markup}}></div>

export const fetchMarkup = markupFetcher("next");
