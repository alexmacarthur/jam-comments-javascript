export class Store {
  store: Map<string, string>;

  constructor() {
    globalThis.jamCommentsStore =
      globalThis.jamCommentsStore || new Map<string, string>();

    this.store = globalThis.jamCommentsStore;
  }

  set(path: string, markup: string): void {
    this.store.set(path, markup);
  }

  get(path: string): string | null {
    return this.store.get(path) || null;
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
}
