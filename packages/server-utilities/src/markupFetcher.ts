interface IFetchData {
  path: string;
  domain: string;
  apiKey: string;
  platform: string;
  baseUrl: string;
  environment?: string;
}

export const markupFetcher = (
  platform: string,
  fetchImplementation = fetch
): Function => {
  return async ({
    path,
    domain,
    apiKey,
    baseUrl = "https://go.jamcomments.com",
    environment = "production",
  }: IFetchData) => {
    const params = new URLSearchParams({
      path: path || "/",
      domain,
    });

    if (environment !== "production") {
      params.set("stub", "true");
    }

    const requestUrl = `${baseUrl}/api/v2/markup?${params}`;
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
        `Unauthorized! Are your domain and JamComments API key set correctly?`
      );
    }

    if (!response.ok) {
      throw new Error(
        `JamComments request failed! Status code: ${response.status}, message: ${response.statusText}, request URL: ${requestUrl}`
      );
    }

    return await response.text();
  };
};
