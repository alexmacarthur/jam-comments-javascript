import isDev from "./isDev";

const OLD_ENV = process.env;

beforeEach(() => {
  jest.resetModules();
});

afterEach(() => {
  jest.clearAllMocks();
});

afterAll(() => {
  process.env = OLD_ENV;
});

it("should return true when in development mode.", () => {
  process.env = {
    NODE_ENV: "development",
  };

  expect(isDev()).toBe(true);
});

it("should return false when in production mode.", () => {
  process.env = {
    NODE_ENV: "production",
  };

  expect(isDev()).toBe(false);
});

it("should fall back to development mode when no NODE_ENV is set.", () => {
  const consoleSpy = jest
    .spyOn(global.console, "error")
    .mockImplementation(() => null);

  process.env = {};
  const result = isDev();

  expect(result).toBe(true);
  expect(consoleSpy).toHaveBeenCalled();
});
