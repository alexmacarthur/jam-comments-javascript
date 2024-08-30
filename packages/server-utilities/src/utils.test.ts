import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getEnvironment, removeFalseyValues, toSavedFileName } from "./utils";

const env = process.env;

beforeEach(() => {
  vi.resetModules();
  process.env = { ...env };
});

afterEach(() => {
  process.env = env;
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

describe("toSavedFileName()", () => {
  it("replaces slashes with double colons", () => {
    expect(toSavedFileName("/hey/there")).toEqual("hey::there");
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
