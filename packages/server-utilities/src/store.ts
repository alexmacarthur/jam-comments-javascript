let STORE: Map<string, string> | null = null;

const store = {
  init() {
    STORE = new Map<string, string>();
  },

  isInitialized() {
    return STORE !== null;
  },

  set(path: string, markup: string) {
    STORE.set(store.toPathKey(path), markup);
  },

  get(path: string) {
    return STORE.get(store.toPathKey(path)) || null;
  },

  clear() {
    if (STORE) {
      STORE.clear();
      STORE = null;
    }
  },

  getEmptyMarkup() {
    return STORE.get("EMPTY");
  },

  toPathKey(path: string) {
    return path.replace(/^\//, "").replace(/\//g, "::");
  },
};

export default store;
