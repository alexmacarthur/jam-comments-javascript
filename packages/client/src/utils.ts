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

export const formatFormValues = (formData: FormData) => {
    return Object.fromEntries(formData.entries());
};

export const getCurrentTime = () => new Date().getTime();

export const getTimeInMilliseconds = (): number => new Date().getTime();
