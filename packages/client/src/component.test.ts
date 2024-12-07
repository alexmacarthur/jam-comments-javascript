import "./component";
import { expect, test } from "vitest";

test("Throws error when API key isn't set.", () => {
  expect(() => {
    document.body.insertAdjacentHTML(
      "beforeend",
      `<jam-comments data-domain="urmom.com"></jam-comments>`,
    );
  }).toThrow("JamComments: The data-api-key attribute is required.");
});
