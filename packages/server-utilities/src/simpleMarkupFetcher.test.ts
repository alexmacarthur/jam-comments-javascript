import * as injectSchema from "./injectSchema";
import { describe, expect, it, vi } from "vitest";
import { simpleMarkupFetcher } from "./simpleMarkupFetcher";

describe("simpleMarkupFetcher", () => {
  it("constructs fetch request correctly", async () => {
    const injectSchemaSpy = vi.spyOn(injectSchema, "injectSchema");
    const fetchMock = vi.fn().mockImplementation(() => {
      return {
        status: 200,
        ok: true,
        text: () => "results!",
      };
    });

    const fetcher = simpleMarkupFetcher("test", fetchMock);

    const result = await fetcher({
      path: "/test",
      domain: "test.com",
      apiKey: "123abc",
      environment: "production",
    });

    expect(injectSchemaSpy).not.toHaveBeenCalled();
    expect(fetchMock).toHaveBeenCalledWith(
      "https://go.jamcomments.com/api/v3/markup?domain=test.com&path=%2Ftest",
      expect.objectContaining({
        headers: expect.objectContaining({
          Accept: "application/json",
          Authorization: "Bearer 123abc",
          "X-Platform": "test",
        }),
        method: "GET",
      }),
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

    const fetcher = simpleMarkupFetcher("test", fetchMock);

    const result = await fetcher({
      path: "/test",
      domain: "test.com",
      apiKey: "123abc",
      environment: "development",
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://go.jamcomments.com/api/v3/markup?domain=test.com&path=%2Ftest&stub=true",
      expect.anything(),
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

    const fetcher = simpleMarkupFetcher("test", fetchMock);

    const result = await fetcher({
      path: "/test",
      domain: "test.com",
      apiKey: "123abc",
      baseUrl: "http://ur-mom.com",
      environment: "production",
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "http://ur-mom.com/api/v3/markup?domain=test.com&path=%2Ftest",
      expect.anything(),
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

    const fetcher = simpleMarkupFetcher("test", fetchMock);

    const result = await fetcher({
      path: "/test",
      domain: "test.com",
      apiKey: "123abc",
      baseUrl: "http://ur-mom.com",
      environment: "production",
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "http://ur-mom.com/api/v3/markup?domain=test.com&path=%2Ftest",
      expect.anything(),
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

    const fetcher = simpleMarkupFetcher("test", fetchMock);

    const result = await fetcher({
      path: null,
      domain: "test.com",
      apiKey: "123abc",
      environment: "production",
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://go.jamcomments.com/api/v3/markup?domain=test.com&path=%2F",
      expect.anything(),
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

    const fetcher = simpleMarkupFetcher("test", fetchMock);

    expect(
      fetcher({
        path: "/test",
        domain: "test.com",
        apiKey: "123abc",
      }),
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

    const fetcher = simpleMarkupFetcher("test", fetchMock);

    expect(
      fetcher({
        path: "/test",
        domain: "test.com",
        apiKey: "123abc",
      }),
    ).rejects.toThrowError(/request failed! Status code: 500/);
  });

  it("passes custom copy", async () => {
    const fetchMock = vi.fn().mockImplementation(() => {
      return {
        status: 200,
        ok: true,
        text: () => "results!",
      };
    });

    const fetcher = simpleMarkupFetcher("test", fetchMock);

    const result = await fetcher({
      path: null,
      domain: "test.com",
      apiKey: "123abc",
      environment: "production",
      copy: {
        copy_confirmation_message: "custom confirmation message",
        copy_submit_button: "custom submit button",
      },
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://go.jamcomments.com/api/v3/markup?domain=test.com&path=%2F&copy_confirmation_message=custom+confirmation+message&copy_submit_button=custom+submit+button",
      expect.anything(),
    );
    expect(result).toEqual("results!");
  });

  it("passes date format string", async () => {
    const fetchMock = vi.fn().mockImplementation(() => {
      return {
        status: 200,
        ok: true,
        text: () => "results!",
      };
    });

    const fetcher = simpleMarkupFetcher("test", fetchMock);

    await fetcher({
      path: null,
      domain: "test.com",
      apiKey: "123abc",
      environment: "production",
      dateFormat: "yyyy-MM-dd",
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://go.jamcomments.com/api/v3/markup?domain=test.com&path=%2F&date_format=yyyy-MM-dd",
      expect.anything(),
    );
  });

  it("response isn't ok", async () => {
    const fetchMock = vi.fn().mockImplementation(() => {
      return {
        status: 500,
        ok: false,
        text: () => "bad results!",
      };
    });

    const fetcher = simpleMarkupFetcher("test", fetchMock);

    expect(
      fetcher({
        path: "/test",
        domain: "test.com",
        apiKey: "123abc",
      }),
    ).rejects.toThrowError(/request failed! Status code: 500/);
  });

  describe("copy overrides", () => {
    it("encodes copy overrides", async () => {
      const fetchMock = vi.fn().mockImplementation(() => {
        return {
          status: 200,
          ok: true,
          text: () => "results!",
        };
      });

      const fetcher = simpleMarkupFetcher("test", fetchMock);

      await fetcher({
        path: "/some/path",
        domain: "test.com",
        apiKey: "123abc",
        environment: "production",
        copy: {
          copy_confirmation_message: "custom confirmation message",
          copy_submit_button: "custom submit button",
        },
      });

      expect(fetchMock).toHaveBeenCalledWith(
        "https://go.jamcomments.com/api/v3/markup?domain=test.com&path=%2Fsome%2Fpath&copy_confirmation_message=custom+confirmation+message&copy_submit_button=custom+submit+button",
        expect.anything(),
      );
    });
  });

  describe("timezone validation", () => {
    it("throws error when invalid timezone is provided", async () => {
      const fetchImplMock = vi.fn();
      const fetcher = simpleMarkupFetcher("test", fetchImplMock);

      expect(fetchImplMock).not.toHaveBeenCalled();
      expect(
        fetcher({
          path: "/test",
          domain: "test.com",
          apiKey: "123abc",
          tz: "in/valid",
          environment: "production",
        }),
      ).rejects.toThrowError(
        "The timezone passed to JamComments is invalid: in/valid",
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

      const fetcher = simpleMarkupFetcher("test", fetchMock);

      const result = await fetcher({
        path: "/some/path",
        domain: "test.com",
        apiKey: "123abc",
        tz: "America/New_York",
        environment: "production",
      });

      expect(fetchMock).toHaveBeenCalledWith(
        "https://go.jamcomments.com/api/v3/markup?domain=test.com&path=%2Fsome%2Fpath&tz=America%2FNew_York",
        expect.anything(),
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

      const fetcher = simpleMarkupFetcher("test", fetchMock);

      const result = await fetcher({
        path: "/some/path",
        domain: "test.com",
        apiKey: "123abc",
        tz: "   America/Chicago   ",
        environment: "production",
      });

      expect(fetchMock).toHaveBeenCalledWith(
        "https://go.jamcomments.com/api/v3/markup?domain=test.com&path=%2Fsome%2Fpath&tz=America%2FChicago",
        expect.anything(),
      );
      expect(result).toEqual("results!");
    });
  });
});
