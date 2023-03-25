declare global {
  interface Window {
    JamComments: {
      initialize: () => void;
    };
  }
}

export interface JamCommentsProps {
  path: string;
}

export default function JamComments({ path }: JamCommentsProps): JSX.Element;
