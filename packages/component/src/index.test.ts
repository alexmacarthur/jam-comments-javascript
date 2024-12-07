import { afterEach, expect, test, vi } from "vitest";

const { initialize } = vi.hoisted(() => {
  return {
    initialize: vi
      .fn()
      .mockImplementation(() => Promise.resolve(document.createElement("div"))),
  };
});

vi.mock("@jam-comments/client", () => {
  return {
    initialize,
  };
});

import ".";

afterEach(() => {
  vi.clearAllMocks();
  document.body.innerHTML = "";
});

test("Renders component correctly.", () => {
  document.body.insertAdjacentHTML(
    "beforeend",
    `<jam-comments data-domain="urmom.com" data-api-key="api-key"></jam-comments>`
  );

  const component = document.querySelector("jam-comments");

  expect(initialize).toHaveBeenCalledOnce();
  expect(initialize).toHaveBeenCalledWith(
    component,
    expect.objectContaining({
      apiKey: "api-key",
      domain: "urmom.com",
      path: window.location.pathname,
      environment: "production",
    })
  );
});

test("Uses window.location.hostname when domain isn't provided.", () => {
  Object.defineProperty(window, "location", {
    value: {
      hostname: "urdad.com",
      pathname: "/path",
    },
  });

  document.body.insertAdjacentHTML(
    "beforeend",
    `<jam-comments data-api-key="api-key"></jam-comments>`
  );

  const component = document.querySelector("jam-comments");

  expect(initialize).toHaveBeenCalledOnce();
  expect(initialize).toHaveBeenCalledWith(
    component,
    expect.objectContaining({
      apiKey: "api-key",
      domain: "urdad.com",
      path: window.location.pathname,
      environment: "production",
    })
  );
});

test("Throws error when API key is missing.", () => {
  expect(() => {
    document.body.insertAdjacentHTML(
      "beforeend",
      `<jam-comments data-domain="urmom.com"></jam-comments>`
    );
  }).toThrow("JamComments: The data-api-key attribute is required.");

  expect(initialize).not.toHaveBeenCalled();
});
