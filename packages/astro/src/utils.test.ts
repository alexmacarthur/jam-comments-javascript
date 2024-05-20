import { expect, it } from "vitest";
import { getCurrentPath } from "./utils";

it("should return the current path", () => {
  const astro = {
    request: {
      url: "https://example.com/test",
    },
  };

  expect(getCurrentPath(astro)).toBe("/test");
});

it("should ignore query parameters", () => {
  const astro = {
    request: {
      url: "https://example.com/test?query=param",
    },
  };

  expect(getCurrentPath(astro)).toBe("/test");
});
