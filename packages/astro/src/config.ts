import { fetchAll } from "@jam-comments/server-utilities";

interface PluginArgs {
  domain: string;
  apiKey: string;
  timezone?: string;
  environment?: string;
}

export function jamComments({
  domain,
  apiKey,
  environment,
  timezone,
}: PluginArgs) {
  return {
    name: "jamcomments",
    hooks: {
      "astro:build:start": () => {
        return fetchAll(
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
        // deleteTempDirectory();
      },
    },
  };
}
