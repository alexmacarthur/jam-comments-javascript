import path from "path";

export const TEMP_DIRECTORY = path.join(process.cwd(), "_temp_jc");

export { markupFetcher, fetchAll } from "./markupFetcher";
export { reAppendMarkup, deleteTempDirectory } from "./utils";
export { log, logError } from "./log";
