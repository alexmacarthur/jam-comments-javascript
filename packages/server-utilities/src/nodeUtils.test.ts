import { describe, expect, it, vi } from "vitest";
import {
  createTempDirectory,
  getTempDirectory,
  readFile,
  saveFile,
} from "./nodeUtils";

describe("createTempDirectory()", () => {
  it("creates temp directory fresh", async () => {
    const tempDirectory = await getTempDirectory();
    const mkdirSyncMock = vi.fn();
    const existsSyncMock = vi.fn().mockReturnValue(false);

    await new Promise<void>((resolve) => {
      expect(async () => {
        await createTempDirectory(mkdirSyncMock, existsSyncMock);
        resolve();
      }).not.toThrow();
    });

    expect(mkdirSyncMock).toHaveBeenCalledWith(tempDirectory);
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

describe("readFile()", () => {
  it("reads the file", async () => {
    const readFileSyncMock = vi.fn().mockReturnValue("file contents");
    const tempDirectory = await getTempDirectory();

    expect(await readFile("hey/there", readFileSyncMock)).toEqual(
      "file contents",
    );
    expect(readFileSyncMock).toHaveBeenCalledWith(
      `${tempDirectory}/hey::there`,
      "utf8",
    );
  });

  it("returns null when file doesn't exist", async () => {
    const readFileSyncMock = vi.fn().mockImplementation(() => {
      throw new Error("File not found");
    });

    expect(await readFile("hey/there", readFileSyncMock)).toEqual(null);
  });
});

describe("saveFile()", () => {
  it("saves the file", async () => {
    const writeFileMock = vi.fn().mockImplementation((file, data, cb) => cb());
    const tempDirectory = await getTempDirectory();

    await saveFile("hey/there", "file contents", writeFileMock);

    expect(writeFileMock).toHaveBeenCalledWith(
      `${tempDirectory}/hey::there`,
      "file contents",
      expect.any(Function),
    );
  });
});
