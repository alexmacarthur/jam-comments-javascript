import { parsePath, makeHtmlReady } from "./utils";

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

describe("makeHtmlReady()", () => {
  it("turns line breaks into paragraph tags", () => {
    const original = "Hello. \n Goodbye.   \n\n Ok!";
    const result = makeHtmlReady(original);

    expect(result).toEqual("<p>Hello.</p><p>Goodbye.</p><p>Ok!</p>");
  });

  it("doesn't bother with content already wrapped in HTML", () => {
    const original = "<strong>More content.</strong><p>Enjoy!</p>";
    const result = makeHtmlReady(original);

    expect(result).toEqual("<strong>More content.</strong><p>Enjoy!</p>");
  });
});
