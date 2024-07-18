import { expect, it } from "vitest";
import { getCurrentPath } from "./utils";
import { AstroGlobal } from "astro";

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
