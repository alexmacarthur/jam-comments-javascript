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
}

export default function JamComments(args: JamCommentsProps): JSX.Element;
