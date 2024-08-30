import { existsSync, mkdirSync, readFileSync, rmdirSync, writeFile } from "fs";
import { toSavedFileName } from "./utils";

export async function getTempDirectory() {
  const path = await import("path");

  return path.join(process.cwd(), "_temp_jc");
}

export async function deleteTempDirectory() {
  const tempDirectory = await getTempDirectory();

  if (existsSync(tempDirectory)) {
    rmdirSync(tempDirectory, { recursive: true });
  }
}

export async function createTempDirectory(
  mkdirSyncImpl = mkdirSync,
  existsSyncImpl = existsSync,
) {
  const tempDirectory = await getTempDirectory();

  if (!(await tempDirectoryExists(existsSyncImpl))) {
    mkdirSyncImpl(tempDirectory);
  }
}

export async function readFile(name, readFileSyncImpl = readFileSync) {
  const fileName = toSavedFileName(name);

  try {
    return readFileSyncImpl(`${await getTempDirectory()}/${fileName}`, "utf8");
  } catch (error) {
    return null;
  }
}

export function getEmptyMarkup() {
  return readFile("EMPTY");
}

export async function tempDirectoryExists(existsSyncImpl = existsSync) {
  return existsSyncImpl(await getTempDirectory());
}

export async function saveFile(
  name: string,
  data: string,
  writeFileImpl: any = writeFile,
): Promise<void> {
  const fileName = toSavedFileName(name);
  const tempDirectory = await getTempDirectory();

  return new Promise<void>(async (resolve) => {
    writeFileImpl(`${tempDirectory}/${fileName}`, data, () => {
      resolve();
    });
  });
}
