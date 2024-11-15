import { describe, expect, it } from "vitest";
import { Store } from "./store";

describe("paths", () => {
  it("cleans path when setting markup", () => {
    const store = new Store();

    store.set("/path", "markup");

    expect(store.get("/path")).toEqual("markup");
    expect(store.get("path")).toEqual("markup");
    expect(store.get("path/")).toEqual("markup");
  });

  it("cleans path with mixed casing", () => {
    const store = new Store();

    store.set("/Path", "markup");

    expect(store.get("/path")).toEqual("markup");
    expect(store.get("path")).toEqual("markup");
    expect(store.get("path/")).toEqual("markup");
  });

  it("works just fine with deep paths", () => {
    const store = new Store();

    store.set("/path/to/deep", "markup");

    expect(store.get("/path/to/deep")).toEqual("markup");
    expect(store.get("path/to/deep")).toEqual("markup");
    expect(store.get("path/to/deep/")).toEqual("markup");
  });
});

it("retrieves EMPTY markup", () => {
  const store = new Store();

  store.set("EMPTY", "empty markup");

  expect(store.emptyMarkup).toEqual("empty markup");
});
