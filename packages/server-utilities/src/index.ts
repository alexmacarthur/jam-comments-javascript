import path from "path";

export type { CustomCopy } from "./markupFetcher";

export const TEMP_DIRECTORY = path.join(process.cwd(), "_temp_jc");

export { markupFetcher, fetchAll } from "./markupFetcher";
export { deleteTempDirectory } from "./utils";
export { log, logError } from "./log";
