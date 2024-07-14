import { beforeEach, describe, expect, it, vi } from "vitest";
import * as injectSchema from "./injectSchema";
import * as fetcherExports from "./markupFetcher";
import { afterEach } from "node:test";
import * as utilsExports from "./utils";

const { deleteTempDirectory } = utilsExports;
const { markupFetcher, batchMarkupFetcher } = fetcherExports;

beforeEach(() => {
  deleteTempDirectory();
});

afterEach(() => {
  vi.resetAllMocks();
});

describe("fetchAll()", () => {
  it("fetches all comments in a single request", async () => {
    const saveFileSpy = vi.spyOn(utilsExports, "saveFile");

    const mockBatchFetcher = vi.fn().mockReturnValue({
      data: [
        { path: "/test", markup: "markup1" },
        { path: "/test2", markup: "markup2" },
      ],
      meta: {
        current_page: 1,
        from: 1,
        last_page: 1,
        path: "/test",
        per_page: 10,
        to: 2,
        total: 2,
      },
    });

    const batchMarkupFetcherMock = vi.fn().mockImplementation((a, b) => {
      return mockBatchFetcher;
    });

    await fetcherExports.fetchAll(
      {
        domain: "test.com",
        apiKey: "123abc",
        environment: "production",
      },
      "test_platform",
      vi.fn(),
      batchMarkupFetcherMock
    );

    expect(batchMarkupFetcherMock).toHaveBeenCalledWith(
      "test_platform",
      expect.anything()
    );

    expect(mockBatchFetcher).toHaveBeenCalledWith({
      domain: "test.com",
      apiKey: "123abc",
      baseUrl: "https://go.jamcomments.com",
      environment: "production",
      page: 1,
      tz: undefined,
    });

    expect(saveFileSpy).toHaveBeenCalledTimes(2);
    expect(saveFileSpy).toHaveBeenCalledWith("/test", "markup1");
    expect(saveFileSpy).toHaveBeenCalledWith("/test2", "markup2");
  });

  it("fetches all comments in multiple requests", async () => {
    const saveFileSpy = vi.spyOn(utilsExports, "saveFile");

    const mockBatchFetcher = vi
      .fn()
      .mockReturnValueOnce({
        data: [
          { path: "/test", markup: "markup1" },
          { path: "/test2", markup: "markup2" },
        ],
        meta: {
          current_page: 1,
          from: 1,
          last_page: 2,
          path: "/test",
          per_page: 2,
          to: 2,
        },
      })
      .mockReturnValueOnce({
        data: [
          { path: "/test3", markup: "markup3" },
          { path: "/test4", markup: "markup4" },
        ],
        meta: {
          current_page: 2,
          from: 3,
          last_page: 2,
          path: "/test",
          per_page: 2,
          to: 4,
        },
      });

    const batchMarkupFetcherMock = vi.fn().mockImplementation((a, b) => {
      return mockBatchFetcher;
    });

    await fetcherExports.fetchAll(
      {
        domain: "test.com",
        apiKey: "123abc",
        environment: "production",
      },
      "test_platform",
      vi.fn(),
      batchMarkupFetcherMock
    );

    expect(batchMarkupFetcherMock).toHaveBeenCalledWith(
      "test_platform",
      expect.anything()
    );

    expect(mockBatchFetcher).toHaveBeenCalledWith({
      domain: "test.com",
      apiKey: "123abc",
      baseUrl: "https://go.jamcomments.com",
      environment: "production",
      page: 1,
      tz: undefined,
    });

    expect(mockBatchFetcher).toHaveBeenCalledTimes(2);

    expect(mockBatchFetcher).toHaveBeenCalledWith({
      domain: "test.com",
      apiKey: "123abc",
      baseUrl: "https://go.jamcomments.com",
      environment: "production",
      page: 2,
      tz: undefined,
    });

    expect(saveFileSpy).toHaveBeenCalledTimes(4);
    expect(saveFileSpy).toHaveBeenCalledWith("/test", "markup1");
    expect(saveFileSpy).toHaveBeenCalledWith("/test2", "markup2");
  });

  it("deletes the temp directory of anything fails", async () => {
    const deleteTempDirectorySpy = vi.spyOn(
      utilsExports,
      "deleteTempDirectory"
    );

    const mockBatchFetcher = vi.fn().mockImplementation(() => {
      throw new Error("test error");
    });

    const batchMarkupFetcherMock = vi.fn().mockImplementation((a, b) => {
      return mockBatchFetcher;
    });

    try {
      await fetcherExports.fetchAll(
        {
          domain: "test.com",
          apiKey: "123abc",
          environment: "production",
        },
        "test_platform",
        vi.fn(),
        batchMarkupFetcherMock
      );
    } catch (e) {
      expect((e as any).message).toEqual("test error");
    }

    expect(deleteTempDirectorySpy).toHaveBeenCalledOnce();
  });
});

describe("batchMarkupFetcher", () => {
  it("constructs fetch request correctly", async () => {
    const injectSchemaSpy = vi.spyOn(injectSchema, "injectSchema");
    const fetchMock = vi.fn().mockImplementation(() => {
      return {
        status: 200,
        ok: true,
        json: () => "results!",
      };
    });

    const fetcher = batchMarkupFetcher("test", fetchMock);

    const result = await fetcher({
      domain: "test.com",
      apiKey: "123abc",
      environment: "production",
    });

    expect(injectSchemaSpy).not.toHaveBeenCalled();
    expect(fetchMock).toHaveBeenCalledWith(
      "https://go.jamcomments.com/api/v3/markup/all?domain=test.com&page=1",
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
        json: () => "results!",
      };
    });

    const fetcher = batchMarkupFetcher("test", fetchMock);

    const result = await fetcher({
      domain: "test.com",
      apiKey: "123abc",
      environment: "development",
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://go.jamcomments.com/api/v3/markup/all?domain=test.com&page=1&stub=true",
      expect.anything()
    );
    expect(result).toEqual("results!");
  });

  it("uses different base URL", async () => {
    const fetchMock = vi.fn().mockImplementation(() => {
      return {
        status: 200,
        ok: true,
        json: () => "results!",
      };
    });

    const fetcher = batchMarkupFetcher("test", fetchMock);

    const result = await fetcher({
      domain: "test.com",
      apiKey: "123abc",
      baseUrl: "http://ur-mom.com",
      environment: "production",
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "http://ur-mom.com/api/v3/markup/all?domain=test.com&page=1",
      expect.anything()
    );
    expect(result).toEqual("results!");
  });
});

describe("markupFetcher", () => {
  it("constructs fetch request correctly", async () => {
    const injectSchemaSpy = vi.spyOn(injectSchema, "injectSchema");
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
      "https://go.jamcomments.com/api/v3/markup?domain=test.com&path=%2Ftest&stub=true",
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
      "http://ur-mom.com/api/v3/markup?domain=test.com&path=%2Ftest",
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
      "http://ur-mom.com/api/v3/markup?domain=test.com&path=%2Ftest",
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
      "https://go.jamcomments.com/api/v3/markup?domain=test.com&path=%2F",
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

  it("passes custom copy", async () => {
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
      copy: {
        copy_confirmation_message: "custom confirmation message",
        copy_submit_button: "custom submit button",
      },
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://go.jamcomments.com/api/v3/markup?domain=test.com&path=%2F&copy_confirmation_message=custom+confirmation+message&copy_submit_button=custom+submit+button",
      expect.anything()
    );
    expect(result).toEqual("results!");
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

  describe("using saved markup", () => {
    it("makes fresh request when temp directory does not exist", async () => {
      const tempDirectoryExistsSpy = vi
        .spyOn(utilsExports, "tempDirectoryExists")
        .mockReturnValue(false);
      const readFileSpy = vi.spyOn(utilsExports, "readFile");

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

      expect(tempDirectoryExistsSpy).toHaveBeenCalledOnce();
      expect(readFileSpy).not.toHaveBeenCalled();
      expect(fetchMock).toHaveBeenCalledWith(
        "https://go.jamcomments.com/api/v3/markup?domain=test.com&path=%2Ftest",
        expect.anything()
      );
      expect(result).toEqual("results!");
    });

    it("uses saved markup when it exists", async () => {
      const tempDirectoryExistsSpy = vi
        .spyOn(utilsExports, "tempDirectoryExists")
        .mockReturnValue(true);
      const readFileSpy = vi
        .spyOn(utilsExports, "readFile")
        .mockReturnValue("saved markup");

      const fetchMock = vi.fn();
      const fetcher = markupFetcher("test", fetchMock);

      const result = await fetcher({
        path: "/test",
        domain: "test.com",
        apiKey: "123abc",
        environment: "production",
      });

      expect(tempDirectoryExistsSpy).toHaveBeenCalledOnce();
      expect(readFileSpy).toHaveBeenCalledOnce();
      expect(fetchMock).not.toHaveBeenCalled();
      expect(result).toEqual("saved markup");
    });

    it("uses the EMPTY template when there's no saved file for a post", async () => {
      const tempDirectoryExistsSpy = vi
        .spyOn(utilsExports, "tempDirectoryExists")
        .mockReturnValue(true);
      const readFileSpy = vi
        .spyOn(utilsExports, "readFile")
        .mockReturnValue(null);
      const getEmptyMarkupSpy = vi
        .spyOn(utilsExports, "getEmptyMarkup")
        .mockReturnValue("<!-- EMPTY -->");

      const fetchMock = vi.fn();
      const fetcher = markupFetcher("test", fetchMock);

      const result = await fetcher({
        path: "/test",
        domain: "test.com",
        apiKey: "123abc",
        environment: "production",
      });

      expect(tempDirectoryExistsSpy).toHaveBeenCalledOnce();
      expect(readFileSpy).toHaveBeenCalledOnce();
      expect(getEmptyMarkupSpy).toHaveBeenCalledOnce();
      expect(fetchMock).not.toHaveBeenCalled();
      expect(result).toEqual("<!-- EMPTY -->");
    });
  });

  describe("timezone validation", () => {
    it("throws error when invalid timezone is provided", async () => {
      const fetchImplMock = vi.fn();
      const fetcher = markupFetcher("test", fetchImplMock);

      expect(fetchImplMock).not.toHaveBeenCalled();
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
        path: "/some/path",
        domain: "test.com",
        apiKey: "123abc",
        tz: "America/New_York",
        environment: "production",
      });

      expect(fetchMock).toHaveBeenCalledWith(
        "https://go.jamcomments.com/api/v3/markup?domain=test.com&path=%2Fsome%2Fpath&tz=America%2FNew_York",
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
        path: "/some/path",
        domain: "test.com",
        apiKey: "123abc",
        tz: "   America/Chicago   ",
        environment: "production",
      });

      expect(fetchMock).toHaveBeenCalledWith(
        "https://go.jamcomments.com/api/v3/markup?domain=test.com&path=%2Fsome%2Fpath&tz=America%2FChicago",
        expect.anything()
      );
      expect(result).toEqual("results!");
    });
  });
});

describe("passing schema", function () {
  it("first stringifies schema if given an object", async () => {
    const injectSchemaSpy = vi.spyOn(injectSchema, "injectSchema");

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
      schema: { foo: "bar" },
      environment: "production",
    });

    expect(injectSchemaSpy).toHaveBeenCalledWith("results!", { foo: "bar" });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://go.jamcomments.com/api/v3/markup?domain=test.com&path=%2Ftest",
      expect.anything()
    );
    expect(result).toEqual("results!");
  });

  it("does not stringify schema if given a string", async () => {
    const injectSchemaSpy = vi.spyOn(injectSchema, "injectSchema");

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
      schema: '{"foo":"bar"}',
      environment: "production",
    });

    expect(injectSchemaSpy).toHaveBeenCalledWith("results!", { foo: "bar" });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://go.jamcomments.com/api/v3/markup?domain=test.com&path=%2Ftest",
      expect.anything()
    );
    expect(result).toEqual("results!");
  });

  it("returns markup if invalid json is provided", async () => {
    const injectSchemaSpy = vi.spyOn(injectSchema, "injectSchema");

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
      schema: "not-valid-json",
      environment: "production",
    });

    expect(injectSchemaSpy).not.toHaveBeenCalled();

    expect(fetchMock).toHaveBeenCalledWith(
      "https://go.jamcomments.com/api/v3/markup?domain=test.com&path=%2Ftest",
      expect.anything()
    );
    expect(result).toEqual("results!");
  });
});
