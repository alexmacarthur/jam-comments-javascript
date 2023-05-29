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

  return process.env?.NODE_ENV || "development";
}
