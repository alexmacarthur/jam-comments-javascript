import { injectSchema } from "./injectSchema";
import { BASE_URL, fetchFreshMarkup, IFetchData } from "./markupFetcher";
import { getEnvironment, parseJson } from "./utils";

export function simpleMarkupFetcher(
  platform: string,
  fetchImplementation: typeof fetch = fetch
): (args: IFetchData) => Promise<string> {
  return async ({
    tz = undefined,
    path,
    cache,
    domain,
    apiKey,
    schema,
    dateFormat,
    baseUrl = BASE_URL,
    environment = getEnvironment(),
    copy = {},
  }: IFetchData): Promise<string> => {
    path = path || "/";

    const markup = await fetchFreshMarkup(
      {
        tz,
        path,
        copy,
        cache,
        domain,
        apiKey,
        baseUrl,
        environment,
        dateFormat,
      },
      fetchImplementation,
      platform
    );

    if (schema) {
      const preparedSchema =
        typeof schema !== "string" ? JSON.stringify(schema) : schema;
      const parsedSchema = parseJson(preparedSchema);

      if (!parsedSchema) {
        return markup;
      }

      return injectSchema(markup, parsedSchema);
    }

    return markup;
  };
}
