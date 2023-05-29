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
