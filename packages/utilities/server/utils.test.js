import { parsePath } from "./utils";

describe("parsePath()", () => {
  it("parses path correctly", () => {
    const result = parsePath("https://example.com/posts/some-post");

    expect(result).toEqual("posts/some-post");
  });

  it("doesn't return a path when none exists", () => {
    const result = parsePath("https://example.com/");

    expect(result).toEqual("");
  });

  it("disregards number of trailing slashes", () => {
    const result = parsePath("https://example.com////howdy/there/pardner////");

    expect(result).toEqual("howdy/there/pardner");
  });
});
