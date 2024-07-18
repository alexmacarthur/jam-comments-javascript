import { CustomCopy } from "@jam-comments/server-utilities";

declare global {
  interface Window {
    JamComments: {
      initialize: () => void;
    };
  }
}

export interface JamCommentsProps {
  path?: string;
  schema?: string | object;
  domain?: string;
  apiKey?: string;
  baseUrl?: string;
  environment?: string;
  tz?: string;
  copy?: CustomCopy;
}

export default function JamComments(args: JamCommentsProps): JSX.Element;
