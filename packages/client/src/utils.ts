/**
 * Convert a Unix timestamp to a nice, pretty format.
 *
 * @param {integer} unix
 * @return {string}
 */
export const toPrettyDate = (isoDate: string) => {
    let date = new Date(isoDate);
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

export const getTimeInMilliseconds = (): number => new Date().getTime();
