declare global {
  interface Window {
    JamComments: {
      initialize: () => void;
    };
  }
}

export interface JamCommentsProps {
  path: string;
  domain?: string;
  apiKey?: string;
  baseUrl?: string;
  environment?: string;
  tz?: string;
}

export default function JamComments({ path }: JamCommentsProps): JSX.Element;
