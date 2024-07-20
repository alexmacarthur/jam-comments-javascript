import { describe, expect, it } from "vitest";
import { getCurrentPath, removeFalseyValues } from "./utils";
import { AstroGlobal } from "astro";

describe("getCurrentPath()", () => {
  it("should return the current path", () => {
    const astro = {
      request: {
        url: "https://example.com/test",
      },
    } as AstroGlobal;

    expect(getCurrentPath(astro)).toBe("/test");
  });

  it("should ignore query parameters", () => {
    const astro = {
      request: {
        url: "https://example.com/test?query=param",
      },
    } as AstroGlobal;

    expect(getCurrentPath(astro)).toBe("/test");
  });
});

describe("removeFalseyValues()", () => {
  it("should remove falsey values", () => {
    expect(removeFalseyValues({ a: 1, b: 0, d: null, e: "" })).toEqual({
      a: 1,
    });
  });

  it("should remove undefined items", () => {
    const customCopy = {
      copy_confirmation_message: "Thank you for your comment!",
      copy_submit_button: "Submit",
      copy_name_placeholder: undefined,
    };

    const result = removeFalseyValues(customCopy);

    expect(result).toEqual({
      copy_confirmation_message: "Thank you for your comment!",
      copy_submit_button: "Submit",
    });
  });
});
