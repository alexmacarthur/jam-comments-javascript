import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getEnvironment, removeFalseyValues, copyToUnderscored } from "./utils";

const env = process.env;

beforeEach(() => {
  vi.resetModules();
  process.env = { ...env };
});

afterEach(() => {
  process.env = env;
});

describe("copyToUnderscored()", () => {
  it("should convert copy object to underscored keys", () => {
    const copy = {
      confirmationMessage: "Thank you for your comment!",
      submitButton: "Submit",
      namePlaceholder: "Name",
      emailPlaceholder: "Email",
      commentPlaceholder: "Comment",
      writeTab: "Write",
      previewTab: "Preview",
      authButton: "Auth",
      logOutButton: "Log Out",
      replyButton: "Reply",
      nameLabel: "Name",
      emailLabel: "Email",
    };

    const result = copyToUnderscored(copy);

    expect(result).toEqual({
      copy_confirmation_message: "Thank you for your comment!",
      copy_submit_button: "Submit",
      copy_name_placeholder: "Name",
      copy_email_placeholder: "Email",
      copy_comment_placeholder: "Comment",
      copy_write_tab: "Write",
      copy_preview_tab: "Preview",
      copy_auth_button: "Auth",
      copy_log_out_button: "Log Out",
      copy_reply_button: "Reply",
      copy_name_label: "Name",
      copy_email_label: "Email",
    });
  });
});

describe("getEnvironment()", () => {
  describe("NODE_ENV is set", () => {
    it("returns environment", () => {
      expect(getEnvironment()).toEqual("test");
    });

    it("falls back to development", () => {
      process.env.NODE_ENV = undefined;

      expect(getEnvironment()).toEqual("development");
    });

    it("returns production environment", () => {
      process.env.NODE_ENV = "production";

      expect(getEnvironment()).toEqual("production");
    });
  });

  describe("JAM_COMMENTS_ENVIRONMENT is set", () => {
    it("returns environment", () => {
      process.env.JAM_COMMENTS_ENVIRONMENT = "staging";

      expect(getEnvironment()).toEqual("staging");
    });

    it("falls back to NODE_ENV", () => {
      process.env.JAM_COMMENTS_ENVIRONMENT = undefined;

      expect(getEnvironment()).toEqual("test");
    });

    it("falls back to development", () => {
      process.env.JAM_COMMENTS_ENVIRONMENT = undefined;
      process.env.NODE_ENV = undefined;

      expect(getEnvironment()).toEqual("development");
    });

    it("returns production environment", () => {
      process.env.JAM_COMMENTS_ENVIRONMENT = "production";

      expect(getEnvironment()).toEqual("production");
    });
  });
});

describe("removeFalseyValues()", () => {
  it("should remove falsey values", () => {
    expect(removeFalseyValues({ a: 1, b: 0, d: null, e: "" })).toEqual({
      a: 1,
    });
  });

  it("should remove undefined items", () => {
    const customCopy = {
      copy_confirmation_message: "Thank you for your comment!",
      copy_submit_button: "Submit",
      copy_name_placeholder: undefined,
    };

    const result = removeFalseyValues(customCopy);

    expect(result).toEqual({
      copy_confirmation_message: "Thank you for your comment!",
      copy_submit_button: "Submit",
    });
  });
});
