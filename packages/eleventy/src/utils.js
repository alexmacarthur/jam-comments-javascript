const path = require("path");
const fs = require("fs");

/**
 * Replace each placeholder with the correct environment variable.
 *
 * @param {string} js
 * @param {string} domain
 * @param {string} apiKey
 * @return {string}
 */
const setEnvironmentVariables = (js, domain, apiKey) => {
  return js
    .replace(/JAM_COMMENTS_DOMAIN/, domain)
    .replace(/JAM_COMMENTS_API_KEY/, apiKey);
};

const dateFromUnix = (unix) => {
  return new Date(Number(unix));
};

/**
 * Get compiled SCSS file contents from directory.
 *
 * @param {string} asset
 * @return {string}
 */
const getCompiledAsset = (asset) => {
  try {
    return fs.readFileSync(
      `${path.join(__dirname, `assets/dist/index.${asset}`)}`,
      "utf8"
    );
  } catch (e) {
    console.error(`JAM COMMENTS ERROR: ${e.message}`);
    return "";
  }
};

/**
 * Get the raw file contents from a file at a given path.
 *
 * @param {string} filePath
 * @return {string}
 */
const getFileContents = (filePath) => {
  try {
    return fs.readFileSync(`${path.join(__dirname, filePath)}`, "utf8");
  } catch (e) {
    return "";
  }
};

/**
 * Convert unix timestamp to ISO string.
 *
 * @param {number} unix
 * @return {string}
 */
const toIsoString = (unix) => {
  return dateFromUnix(unix).toISOString();
};

/**
 * Convert a Unix timestamp to a nice, pretty format.
 *
 * @param {integer} unix
 * @return {string}
 */
const toPrettyDate = (unix) => {
  let date = dateFromUnix(unix);
  let hoursOffset = date.getTimezoneOffset() / 60;
  date.setHours(date.getHours() - hoursOffset);
  let dateString = date.toLocaleString("en-US").split(",");
  return dateString[0].trim();
};

module.exports = {
  toPrettyDate,
  toIsoString,
  getCompiledAsset,
  getFileContents,
  setEnvironmentVariables,
};
