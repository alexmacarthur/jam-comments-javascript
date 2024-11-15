export class Store {
  store: Map<string, string>;

  constructor() {
    globalThis.jamCommentsStore =
      globalThis.jamCommentsStore || new Map<string, string>();

    this.store = globalThis.jamCommentsStore;
  }

  set(path: string, markup: string): void {
    this.store.set(this.#normalizePath(path), markup);
  }

  get(path: string): string | null {
    return this.store.get(this.#normalizePath(path)) || null;
  }

  clear(): void {
    this.store.clear();
  }

  get hasData(): boolean {
    return this.store.size > 0;
  }

  get emptyMarkup(): string | null {
    return this.store.get("EMPTY") || null;
  }

  #normalizePath(path: string): string {
    if (path === "EMPTY") {
      return path;
    }

    let withLeadingSlash = path.startsWith("/") ? path : `/${path}`;
    let withNoTrailingSlash = withLeadingSlash.endsWith("/")
      ? withLeadingSlash.slice(0, -1)
      : withLeadingSlash;

    return withNoTrailingSlash.toLowerCase();
  }
}
