import { CustomCopy } from ".";
import { UnderscoredCopy } from "./types";

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

export function copyToUnderscored(copy: CustomCopy): UnderscoredCopy {
  return removeFalseyValues({
    copy_confirmation_message: copy.confirmationMessage,
    copy_submit_button: copy.submitButton,
    copy_name_placeholder: copy.namePlaceholder,
    copy_email_placeholder: copy.emailPlaceholder,
    copy_comment_placeholder: copy.commentPlaceholder,
    copy_write_tab: copy.writeTab,
    copy_preview_tab: copy.previewTab,
    copy_auth_button: copy.authButton,
    copy_log_out_button: copy.logOutButton,
    copy_reply_button: copy.replyButton,
    copy_name_label: copy.nameLabel,
    copy_email_label: copy.emailLabel,
  });
}
