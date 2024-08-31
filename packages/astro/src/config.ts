import { fetchAll } from "@jam-comments/server-utilities";

interface PluginArgs {
  domain: string;
  apiKey: string;
  timezone?: string;
  environment?: string;
}

globalThis.jamCommentsStore = new Map<string, string>();

export function jamComments({
  domain,
  apiKey,
  environment,
  timezone,
}: PluginArgs) {
  return {
    name: "jamcomments",
    hooks: {
      "astro:build:start": async () => {
        globalThis.jamCommentsStore = await fetchAll(
          {
            tz: timezone,
            domain,
            apiKey,
            environment,
          },
          "astro",
          fetch,
        );
      },

      "astro:build:done": () => {
        globalThis.jamCommentsStore.clear();
      },
    },
  };
}
