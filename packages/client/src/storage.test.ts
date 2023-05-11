import { expect, it } from "vitest";
import { getStorage, removeStorage, setStorage } from "./storage";

it("should set the storage", () => {
  setStorage("avatar_url", "name");

  expect(getStorage()).toEqual({ avatar_url: "avatar_url", name: "name" });
});

it("should remove the storage", () => {
  setStorage("avatar_url", "name");

  expect(getStorage()).toEqual({ avatar_url: "avatar_url", name: "name" });

  removeStorage();

  expect(getStorage()).toEqual(null);
});
