import { describe, it, expect, beforeEach, vi } from "vitest";
import { deleteTokenFromCookie, getTokenFromCookie } from "./utils";

describe("getTokenFromCookie()", () => {
  it("should return the token from the cookie", () => {
    document.cookie =
      "jc_token=token;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;";

    expect(getTokenFromCookie()).toEqual("token");
  });

  it("returns undefined when cookie is not set", () => {
    document.cookie =
      "your_mom=token;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;";

    expect(getTokenFromCookie()).toEqual(undefined);
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
