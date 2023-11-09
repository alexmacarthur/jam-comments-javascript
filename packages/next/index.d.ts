declare global {
  interface Window {
    JamComments: {
      initialize: () => void;
      isInitialized: boolean;
    };
    jcAlpine: any;
  }
}

export {};
