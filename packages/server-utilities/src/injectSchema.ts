import { parseJson, unescapeHTML } from "./utils";

export function injectSchema(
  markup: string,
  schema: Record<string, any>,
): string {
  const commentSchema = markup.match(
    /<div jc-data="jcSchema" data-schema="(.*)"><\/div>/,
  )?.[1];

  const json = commentSchema ? parseJson(unescapeHTML(commentSchema)) : null;

  if (json) {
    schema.comment = json;
  }

  return markup
    .replace(
      "<!-- JC:SCHEMA -->",
      `<script type="application/ld+json">${JSON.stringify(schema)}</script>`,
    )
    .replace(/<div jc-data="jcSchema" data-schema=".*"><\/div>(?:\n+)?/, "");
}
