import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  getEnvironment,
  createTempDirectory,
  toSavedFileName,
  readFile,
  saveFile,
} from "./utils";
import { TEMP_DIRECTORY } from ".";

const env = process.env;

beforeEach(() => {
  vi.resetModules();
  process.env = { ...env };
});

afterEach(() => {
  process.env = env;
});

describe("getEnvironment()", () => {
  describe("NODE_ENV is set", () => {
    it("returns environment", () => {
      expect(getEnvironment()).toEqual("test");
    });

    it("falls back to development", () => {
      process.env.NODE_ENV = undefined;

      expect(getEnvironment()).toEqual("development");
    });

    it("returns production environment", () => {
      process.env.NODE_ENV = "production";

      expect(getEnvironment()).toEqual("production");
    });
  });

  describe("JAM_COMMENTS_ENVIRONMENT is set", () => {
    it("returns environment", () => {
      process.env.JAM_COMMENTS_ENVIRONMENT = "staging";

      expect(getEnvironment()).toEqual("staging");
    });

    it("falls back to NODE_ENV", () => {
      process.env.JAM_COMMENTS_ENVIRONMENT = undefined;

      expect(getEnvironment()).toEqual("test");
    });

    it("falls back to development", () => {
      process.env.JAM_COMMENTS_ENVIRONMENT = undefined;
      process.env.NODE_ENV = undefined;

      expect(getEnvironment()).toEqual("development");
    });

    it("returns production environment", () => {
      process.env.JAM_COMMENTS_ENVIRONMENT = "production";

      expect(getEnvironment()).toEqual("production");
    });
  });
});

describe("createTempDirectory()", () => {
  it("creates temp directory fresh", () => {
    const mkdirSyncMock = vi.fn();
    const existsSyncMock = vi.fn().mockReturnValue(false);

    expect(() =>
      createTempDirectory(mkdirSyncMock, existsSyncMock),
    ).not.toThrow();
    expect(mkdirSyncMock).toHaveBeenCalledWith(TEMP_DIRECTORY);
  });

  it("does not throw error when it already exists", () => {
    const mkdirSyncMock = vi.fn().mockImplementation(() => {
      throw new Error("Directory already exists");
    });
    const existsSyncMock = vi.fn().mockReturnValue(true);

    expect(() =>
      createTempDirectory(mkdirSyncMock, existsSyncMock),
    ).not.toThrow();
    expect(mkdirSyncMock).not.toHaveBeenCalledWith();
  });
});

describe("toSavedFileName()", () => {
  it("replaces slashes with double colons", () => {
    expect(toSavedFileName("/hey/there")).toEqual("hey::there");
  });
});

describe("readFile()", () => {
  it("reads the file", () => {
    const readFileSyncMock = vi.fn().mockReturnValue("file contents");

    expect(readFile("hey/there", readFileSyncMock)).toEqual("file contents");
    expect(readFileSyncMock).toHaveBeenCalledWith(
      `${TEMP_DIRECTORY}/hey::there`,
      "utf8",
    );
  });

  it("returns null when file doesn't exist", () => {
    const readFileSyncMock = vi.fn().mockImplementation(() => {
      throw new Error("File not found");
    });

    expect(readFile("hey/there", readFileSyncMock)).toEqual(null);
  });
});

describe("saveFile()", () => {
  it("saves the file", async () => {
    const writeFileMock = vi.fn();

    const result = saveFile("hey/there", "file contents", writeFileMock);

    expect(writeFileMock).toHaveBeenCalledWith(
      `${TEMP_DIRECTORY}/hey::there`,
      "file contents",
      expect.any(Function),
    );
    expect(result).toBeInstanceOf(Promise);
  });
});
