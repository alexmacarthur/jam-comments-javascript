import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  deleteTokenFromCookie,
  getTokenFromCookie,
  removeTokenFromUrl,
} from "./utils";

describe("getTokenFromCookie()", () => {
  it("should return the token from the cookie", () => {
    document.cookie =
      "jc_token=token;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;";

    expect(getTokenFromCookie()).toEqual("token");
  });

  it("returns undefined when cookie is not set", () => {
    document.cookie =
      "your_mom=token;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;";

    expect(getTokenFromCookie()).toEqual("");
  });
});

describe("deleteTokenFromCookie()", () => {
  it("deletes the cookie", () => {
    deleteTokenFromCookie();

    expect(document.cookie).toEqual(
      "jc_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    );
  });
});

describe("removeTokenFromUrl()", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  function getHistorySpy() {
    return vi.spyOn(window.history, "replaceState");
  }

  it("replaces jc_token when it's in the URL", () => {
    vi.spyOn(window, "location", "get").mockReturnValue({
      href: "https://example.com/hey?jc_token=hello",
    } as Location);

    const replaceSpy = getHistorySpy();

    removeTokenFromUrl();

    expect(replaceSpy).toHaveBeenCalledWith(
      {},
      null,
      "https://example.com/hey"
    );
  });

  it("preserves hash", () => {
    vi.spyOn(window, "location", "get").mockReturnValue({
      href: "https://example.com/hey?jc_token=hello#comment-1",
    } as Location);

    const replaceSpy = getHistorySpy();

    removeTokenFromUrl();

    expect(replaceSpy).toHaveBeenCalledWith(
      {},
      null,
      "https://example.com/hey#comment-1"
    );
  });

  it("preserves multiple query parameters", () => {
    vi.spyOn(window, "location", "get").mockReturnValue({
      href: "https://example.com/hey?something=true&jc_token=hello&something-else=ho",
    } as Location);

    const replaceSpy = getHistorySpy();

    removeTokenFromUrl();

    expect(replaceSpy).toHaveBeenCalledWith(
      {},
      null,
      "https://example.com/hey?something=true&something-else=ho"
    );
  });

  it("token isn't there", () => {
    vi.spyOn(window, "location", "get").mockReturnValue({
      href: "https://example.com/hey?something=true&something-else=ho",
    } as Location);

    const replaceSpy = getHistorySpy();

    removeTokenFromUrl();

    expect(replaceSpy).toHaveBeenCalledWith(
      {},
      null,
      "https://example.com/hey?something=true&something-else=ho"
    );
  });
});
