import { injectSchema } from "./injectSchema";
import {
  createTempDirectory,
  deleteTempDirectory,
  getEmptyMarkup,
  getEnvironment,
  isValidTimezone,
  parseJson,
  readFile,
  saveFile,
  tempDirectoryExists,
} from "./utils";

export interface IFetchData {
  path: string;
  domain: string;
  apiKey: string;
  schema?: string | object;
  tz?: string;
  baseUrl?: string;
  environment?: string;
}

export type IBatchFetchData = Omit<IFetchData, "path" | "schema"> & {
  page?: number;
};

interface IBatchResponse {
  data: {
    path: string;
    markup: string;
  }[];
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
}

export async function fetchAll(
  {
    tz = undefined,
    domain,
    apiKey,
    baseUrl = "https://go.jamcomments.com",
    environment = getEnvironment(),
  }: IBatchFetchData,
  platform: string,
  fetchImplementation: any = fetch,
  batchMarkupFetcherImpl: any = batchMarkupFetcher,
) {
  const fetchBatchMarkup = batchMarkupFetcherImpl(
    platform,
    fetchImplementation,
  );

  createTempDirectory();

  let shouldKeepFetching = true;
  let page = 1;

  console.log("Fetching comments from JamComments! This might take a sec.");

  try {
    while (shouldKeepFetching) {
      const {
        data: items,
        meta: { current_page, last_page },
      } = await fetchBatchMarkup({
        domain,
        apiKey,
        baseUrl,
        environment,
        page,
        tz,
      });

      console.log(
        `Checking for comment data. Batch: ${current_page}/${last_page}`,
      );

      const saveMarkupPromises = items.map((item) => {
        return saveFile(item.path, item.markup);
      });

      await Promise.all(saveMarkupPromises);

      if (current_page === last_page) {
        shouldKeepFetching = false;
      } else {
        page++;
      }
    }
  } catch (error) {
    deleteTempDirectory();

    throw error;
  }
}

export function batchMarkupFetcher(
  platform: string,
  fetchImplementation: typeof fetch = fetch,
): (args: IBatchFetchData) => Promise<IBatchResponse> {
  return async ({
    tz = undefined,
    domain,
    apiKey,
    baseUrl = "https://go.jamcomments.com",
    environment = getEnvironment(),
    page = 1,
  }: IBatchFetchData): Promise<IBatchResponse> => {
    const response = await makeMarkupRequest<IBatchFetchData>(
      { tz, domain, apiKey, baseUrl, environment, page },
      "/api/v3/markup/all",
      fetchImplementation,
      platform,
    );

    return response.json();
  };
}

export async function fetchFreshMarkup(
  {
    tz = undefined,
    path,
    domain,
    apiKey,
    baseUrl = "https://go.jamcomments.com",
    environment = getEnvironment(),
  }: IFetchData,
  fetchImplementation: typeof fetch = fetch,
  platform: string,
): Promise<string> {
  const response = await makeMarkupRequest(
    { tz, path, domain, apiKey, baseUrl, environment },
    "/api/v3/markup",
    fetchImplementation,
    platform,
  );

  return response.text();
}

export async function makeMarkupRequest<
  T extends Partial<IBatchFetchData & IFetchData>,
>(
  {
    tz = undefined,
    path = undefined,
    domain,
    apiKey,
    baseUrl = "https://go.jamcomments.com",
    environment = getEnvironment(),
    page = undefined,
  }: T,
  baseServicePath: string,
  fetchImplementation: typeof fetch = fetch,
  platform: string,
): Promise<Response> {
  const trimmedTimezone = tz?.trim();

  if (trimmedTimezone && !isValidTimezone(trimmedTimezone)) {
    throw new Error(
      `The timezone passed to JamComments is invalid: ${trimmedTimezone}`,
    );
  }

  const params = new URLSearchParams({
    domain,
  });

  if (path) {
    params.set("path", path);
  }

  if (page) {
    params.set("page", page.toString());
  }

  if (trimmedTimezone) {
    params.set("tz", trimmedTimezone);
  }

  if (environment !== "production") {
    params.set("stub", "true");
  }

  const requestUrl = `${baseUrl}${baseServicePath}?${params}`;
  const response = await fetchImplementation(requestUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: "application/json",
      "X-Platform": platform,
    },
  });

  if (response.status === 401) {
    throw new Error(
      `Unauthorized! Are your domain and JamComments API key set correctly?`,
    );
  }

  if (!response.ok) {
    throw new Error(
      `JamComments request failed! Status code: ${response.status}, message: ${response.statusText}, request URL: ${requestUrl}`,
    );
  }

  return response;
}

export function markupFetcher(
  platform: string,
  fetchImplementation: typeof fetch = fetch,
): (args: IFetchData) => Promise<string> {
  return async ({
    tz = undefined,
    path,
    domain,
    apiKey,
    schema,
    baseUrl = "https://go.jamcomments.com",
    environment = getEnvironment(),
  }: IFetchData): Promise<string> => {
    path = path || "/";

    const savedFile = (() => {
      if (!tempDirectoryExists()) {
        return null;
      }

      return readFile(path) || getEmptyMarkup();
    })();

    const markup = savedFile
      ? savedFile
      : await fetchFreshMarkup(
          { tz, path, domain, apiKey, baseUrl, environment },
          fetchImplementation,
          platform,
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
