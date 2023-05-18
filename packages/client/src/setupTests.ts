import { beforeEach, afterEach, vi } from "vitest";

let cookieJar = document.cookie;

beforeEach(() => {
  // @ts-ignore
  vi.spyOn(window, "location", "get").mockReturnValue({ search: "?" });

  vi.spyOn(document, "cookie", "set").mockImplementation((cookie) => {
    cookieJar += cookie;
  });

  vi.spyOn(document, "cookie", "get").mockImplementation(() => cookieJar);

  // Wipe after each test.
  cookieJar = "";
});

afterEach(() => {
  cookieJar = "";

  vi.resetAllMocks();
});
