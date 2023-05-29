import { describe, expect, it, vi } from "vitest";
import { markupFetcher } from "./markupFetcher";

describe("markupFetcher", () => {
  it("constructs fetch request correctly", async () => {
    const fetchMock = vi.fn().mockImplementation(() => {
      return {
        status: 200,
        ok: true,
        text: () => "results!",
      };
    });

    const fetcher = markupFetcher("test", fetchMock);

    const result = await fetcher({
      path: "/test",
      domain: "test.com",
      apiKey: "123abc",
      environment: "production",
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://go.jamcomments.com/api/v2/markup?path=%2Ftest&domain=test.com",
      expect.objectContaining({
        headers: expect.objectContaining({
          Accept: "application/json",
          Authorization: "Bearer 123abc",
          "X-Platform": "test",
        }),
        method: "GET",
      })
    );
    expect(result).toEqual("results!");
  });

  it("stubs comments", async () => {
    const fetchMock = vi.fn().mockImplementation(() => {
      return {
        status: 200,
        ok: true,
        text: () => "results!",
      };
    });

    const fetcher = markupFetcher("test", fetchMock);

    const result = await fetcher({
      path: "/test",
      domain: "test.com",
      apiKey: "123abc",
      environment: "development",
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://go.jamcomments.com/api/v2/markup?path=%2Ftest&domain=test.com&stub=true",
      expect.anything()
    );
    expect(result).toEqual("results!");
  });

  it("uses different base URL", async () => {
    const fetchMock = vi.fn().mockImplementation(() => {
      return {
        status: 200,
        ok: true,
        text: () => "results!",
      };
    });

    const fetcher = markupFetcher("test", fetchMock);

    const result = await fetcher({
      path: "/test",
      domain: "test.com",
      apiKey: "123abc",
      baseUrl: "http://ur-mom.com",
      environment: "production",
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "http://ur-mom.com/api/v2/markup?path=%2Ftest&domain=test.com",
      expect.anything()
    );
    expect(result).toEqual("results!");
  });

  it("respects production!!!", async () => {
    const fetchMock = vi.fn().mockImplementation(() => {
      return {
        status: 200,
        ok: true,
        text: () => "results!",
      };
    });

    const fetcher = markupFetcher("test", fetchMock);

    const result = await fetcher({
      path: "/test",
      domain: "test.com",
      apiKey: "123abc",
      baseUrl: "http://ur-mom.com",
      environment: "production",
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "http://ur-mom.com/api/v2/markup?path=%2Ftest&domain=test.com",
      expect.anything()
    );
    expect(result).toEqual("results!");
  });

  it("falls back to root path", async () => {
    const fetchMock = vi.fn().mockImplementation(() => {
      return {
        status: 200,
        ok: true,
        text: () => "results!",
      };
    });

    const fetcher = markupFetcher("test", fetchMock);

    const result = await fetcher({
      path: null,
      domain: "test.com",
      apiKey: "123abc",
      environment: "production",
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://go.jamcomments.com/api/v2/markup?path=%2F&domain=test.com",
      expect.anything()
    );
    expect(result).toEqual("results!");
  });

  it("credentials are invalid", async () => {
    const fetchMock = vi.fn().mockImplementation(() => {
      return {
        status: 401,
        ok: false,
        text: () => "bad results!",
      };
    });

    const fetcher = markupFetcher("test", fetchMock);

    expect(
      fetcher({
        path: "/test",
        domain: "test.com",
        apiKey: "123abc",
      })
    ).rejects.toThrowError(/Unauthorized!/);
  });

  it("response isn't ok", async () => {
    const fetchMock = vi.fn().mockImplementation(() => {
      return {
        status: 500,
        ok: false,
        text: () => "bad results!",
      };
    });

    const fetcher = markupFetcher("test", fetchMock);

    expect(
      fetcher({
        path: "/test",
        domain: "test.com",
        apiKey: "123abc",
      })
    ).rejects.toThrowError(/request failed! Status code: 500/);
  });

  describe("timezone validation", () => {
    it("throws error when invalid timezone is provided", async () => {
      const fetchMock = vi.fn();
      const fetcher = markupFetcher("test", fetchMock);

      expect(fetchMock).not.toHaveBeenCalled();
      expect(
        fetcher({
          path: "/test",
          domain: "test.com",
          apiKey: "123abc",
          tz: "in/valid",
          environment: "production",
        })
      ).rejects.toThrowError(
        "The timezone passed to JamComments is invalid: in/valid"
      );
    });

    it("does not throw error when valid timezone is provided", async () => {
      const fetchMock = vi.fn().mockImplementation(() => {
        return {
          status: 200,
          ok: true,
          text: () => "results!",
        };
      });

      const fetcher = markupFetcher("test", fetchMock);

      const result = await fetcher({
        path: null,
        domain: "test.com",
        apiKey: "123abc",
        tz: "America/New_York",
        environment: "production",
      });

      expect(fetchMock).toHaveBeenCalledWith(
        "https://go.jamcomments.com/api/v2/markup?path=%2F&domain=test.com&tz=America%2FNew_York",
        expect.anything()
      );
      expect(result).toEqual("results!");
    });

    it("trims a valid timezone", async () => {
      const fetchMock = vi.fn().mockImplementation(() => {
        return {
          status: 200,
          ok: true,
          text: () => "results!",
        };
      });

      const fetcher = markupFetcher("test", fetchMock);

      const result = await fetcher({
        path: null,
        domain: "test.com",
        apiKey: "123abc",
        tz: "   America/Chicago   ",
        environment: "production",
      });

      expect(fetchMock).toHaveBeenCalledWith(
        "https://go.jamcomments.com/api/v2/markup?path=%2F&domain=test.com&tz=America%2FChicago",
        expect.anything()
      );
      expect(result).toEqual("results!");
    });
  });
});
