import {
  copyToUnderscored,
  CustomCopy,
  fetchAll,
} from "@jam-comments/server-utilities";

interface PluginArgs {
  domain: string;
  apiKey: string;
  copy?: CustomCopy;
  timezone?: string;
  environment?: string;
}

globalThis.jamCommentsStore = new Map<string, string>();

export function jamComments({
  domain,
  apiKey,
  copy = {},
  environment,
  timezone,
}: PluginArgs) {
  return {
    name: "jamcomments",
    hooks: {
      "astro:build:start": async () => {
        globalThis.jamCommentsStore = await fetchAll(
          {
            domain,
            apiKey,
            environment,
            tz: timezone,
            copy: copyToUnderscored(copy),
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
