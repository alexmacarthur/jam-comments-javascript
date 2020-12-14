const dateFromUnix = unix => {
  return new Date(Number(unix));
};

export const toPrettyDate = unix => {
  let date = dateFromUnix(unix);
  let hoursOffset = date.getTimezoneOffset() / 60;
  date.setHours(date.getHours() - hoursOffset);
  let dateString = date.toLocaleString("en-US").split(",");
  return dateString[0].trim();
};

export const toIsoString = unix => {
  return dateFromUnix(unix).toISOString();
};
