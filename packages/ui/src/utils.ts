/**
 * Given a timestamp, convert it to a Date object.
 *
 * @param {number} unix
 * @return {Date}
 */
export const dateFromUnix = (unix) => {
  return new Date(Number(unix));
};

/**
 * Convert unix timestamp to ISO string.
 *
 * @param {number} unix
 * @return {string}
 */
export const toIsoString = (unix) => {
  return dateFromUnix(unix).toISOString();
};

/**
 * Convert a Unix timestamp to a nice, pretty format.
 *
 * @param {integer} unix
 * @return {string}
 */
export const toPrettyDate = (unix) => {
  let date = dateFromUnix(unix);
  let hoursOffset = date.getTimezoneOffset() / 60;
  date.setHours(date.getHours() - hoursOffset);
  let dateString = date.toLocaleString("en-US").split(",");
  return dateString[0].trim();
};

/**
 * Given a list of elements, convert the values into an object.
 *
 * @param {NodeList} htmlElementCollection
 * @return {object}
 */
export const formatFormValues = (htmlElementCollection) => {
  return [...htmlElementCollection].reduce((acc, item) => {
    if (!item.name) return acc;

    acc[item.name] = item.value;
    return acc;
  }, {});
};

export const getCurrentTime = () => new Date().getTime();
