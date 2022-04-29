import getServiceEndpoint from "./getServiceEndpoint";

const OLD_ENV = process.env;

beforeEach(() => {
  jest.resetModules();
});

afterAll(() => {
  process.env = OLD_ENV;
});

test("it should return production service endpoint when no override is set.", () => {
  process.env = {
    NODE_ENV: "production",
  };

  const result = getServiceEndpoint();

  expect(result).toEqual("https://service.jamcomments.com");
});

test("it should use override env variable when it is set.", () => {
  process.env = {
    JAM_COMMENTS_SERVICE_ENDPOINT: "http://localhost:4000",
  };

  const result = getServiceEndpoint();

  expect(result).toEqual("http://localhost:4000");
});

test("it should use explicitly provided endpoint", () => {
  const result = getServiceEndpoint("http://whatever.com");

  expect(result).toEqual("http://whatever.com");
});
