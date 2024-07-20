import { existsSync, mkdirSync, readFileSync, rmdirSync, writeFile } from "fs";
import { TEMP_DIRECTORY } from ".";

export function isValidTimezone(tz: string): boolean {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: tz });
    return true;
  } catch (ex) {
    return false;
  }
}

export function getEnvironment(): string {
  if (typeof process === "undefined") {
    return "production";
  }

  return (
    process.env?.JAM_COMMENTS_ENVIRONMENT ||
    process.env?.NODE_ENV ||
    "development"
  );
}

export function parseJson(json: string) {
  try {
    return JSON.parse(json);
  } catch (ex) {
    return null;
  }
}

export function unescapeHTML(str) {
  var htmlEntities = {
    nbsp: " ",
    cent: "¢",
    pound: "£",
    yen: "¥",
    euro: "€",
    copy: "©",
    reg: "®",
    lt: "<",
    gt: ">",
    quot: '"',
    amp: "&",
    apos: "'",
  };

  return str.replace(/\&([^;]+);/g, function (entity, entityCode) {
    var match;

    if (entityCode in htmlEntities) {
      return htmlEntities[entityCode];
    } else if ((match = entityCode.match(/^#x([\da-fA-F]+)$/))) {
      return String.fromCharCode(parseInt(match[1], 16));
    } else if ((match = entityCode.match(/^#(\d+)$/))) {
      return String.fromCharCode(~~match[1]);
    } else {
      return entity;
    }
  });
}

export function deleteTempDirectory() {
  if (existsSync(TEMP_DIRECTORY)) {
    rmdirSync(TEMP_DIRECTORY, { recursive: true });
  }
}

export function createTempDirectory(
  mkdirSyncImpl = mkdirSync,
  existsSyncImpl = existsSync,
) {
  if (!tempDirectoryExists(existsSyncImpl)) {
    mkdirSyncImpl(TEMP_DIRECTORY);
  }
}

export function toSavedFileName(name: string): string {
  return name.replace(/^\//, "").replace(/\//g, "::");
}

export function readFile(name, readFileSyncImpl = readFileSync) {
  const fileName = toSavedFileName(name);

  try {
    return readFileSyncImpl(`${TEMP_DIRECTORY}/${fileName}`, "utf8");
  } catch (error) {
    return null;
  }
}

export function getEmptyMarkup() {
  return readFile("EMPTY");
}

export function tempDirectoryExists(existsSyncImpl = existsSync) {
  return existsSyncImpl(TEMP_DIRECTORY);
}

export function saveFile(
  name: string,
  data: string,
  writeFileImpl: any = writeFile,
) {
  const fileName = toSavedFileName(name);

  return new Promise<void>((resolve) => {
    writeFileImpl(`${TEMP_DIRECTORY}/${fileName}`, data, () => {
      resolve();
    });
  });
}

export function removeFalseyValues<T>(obj: T): Partial<T> {
  const filteredItems = Object.entries(obj).filter(([, value]) => value);

  return Object.fromEntries(filteredItems) as Partial<T>;
}
