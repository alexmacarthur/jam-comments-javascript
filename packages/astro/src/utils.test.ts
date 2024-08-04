import { describe, expect, it, vi } from "vitest";
import { fetchCommentData, getCurrentPath, removeFalseyValues } from "./utils";
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

describe("fetchCommentData()", () => {
  it("passes the correct arguments to fetchMarkup", async () => {
    const mockResponse = vi.fn();
    const fetchMock = vi.fn().mockImplementation(() => mockResponse);

    const result = await fetchCommentData(
      {
        copy: {
          confirmationMessage: "my confirmation message",
        },
        apiKey: "123",
        dateFormat: "YYYY-MM-DD",
        path: "/test",
        domain: "example.com",
        environment: "production",
        baseUrl: "https://example.com",
      },
      fetchMock,
    );

    expect(fetchMock).toHaveBeenCalledWith({
      copy: {
        copy_confirmation_message: "my confirmation message",
      },
      apiKey: "123",
      dateFormat: "YYYY-MM-DD",
      path: "/test",
      domain: "example.com",
      environment: "production",
      baseUrl: "https://example.com",
    });

    expect(result).toBe(mockResponse);
  });

  it("returns null if fetchMarkup throws an error", async () => {
    const fetchMock = vi.fn().mockImplementation(() => {
      throw new Error("test error");
    });

    const result = await fetchCommentData(
      {
        copy: {
          confirmationMessage: "my confirmation message",
        },
        apiKey: "123",
        path: "/test",
        domain: "example.com",
        dateFormat: "YYYY-MM-DD",
        environment: "production",
        baseUrl: "https://example.com",
      },
      fetchMock,
    );

    expect(result).toBeNull();
  });
});
