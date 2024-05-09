import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getEnvironment } from "./utils";

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
