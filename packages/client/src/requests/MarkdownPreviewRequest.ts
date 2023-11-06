const MarkdownPreviewRequest = (
  { endpoint, apiKey }: { endpoint: string; apiKey: string },
  fetchImplementation = fetch
) => {
  return async (content: string, signal: AbortSignal): Promise<string> => {
    try {
      const response = await fetchImplementation(endpoint, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`, // For the site owner.
        },
        signal,
        body: JSON.stringify({
          markdown: content,
        }),
      });

      const data = await response.json();

      return data.html;
    } catch (e: any) {
      if (e.name !== "AbortError") {
        throw e;
      }

      return "";
    }
  };
};

export default MarkdownPreviewRequest;
