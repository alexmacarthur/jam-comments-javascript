const MarkdownPreviewRequest = (
  { endpoint, apiKey },
  fetchImplementation = fetch
) => {
  return async (content: string): Promise<string> => {
    const response = await fetchImplementation(endpoint, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`, // For the site owner.
      },
      body: JSON.stringify({
        markdown: content,
      }),
    });

    const data = await response.json();

    return data.html;
  };
};

export default MarkdownPreviewRequest;
