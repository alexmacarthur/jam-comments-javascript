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

export function removeFalseyValues<T>(obj: T): Partial<T> {
  const filteredItems = Object.entries(obj).filter(([, value]) => value);

  return Object.fromEntries(filteredItems) as Partial<T>;
}
