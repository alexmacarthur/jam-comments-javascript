import { expect, it } from "vitest";
import { injectSchema } from "./injectSchema";

it("injects schema into markup", () => {
  const markup = `
<div id="jcComments">
    <div jc-data="jcSchema" data-schema="[{&quot;@context&quot;:&quot;https:\/\/schema.org&quot;,&quot;@type&quot;:&quot;Comment&quot;,&quot;name&quot;:&quot;Alexis&quot;,&quot;dateCreated&quot;:&quot;2022-10-28T10:41:49+00:00&quot;,&quot;url&quot;:&quot;https:\/\/macarthur.me\/posts\/dynamic-routing#comment-133&quot;}]"></div>

<!-- JC:SCHEMA -->
</div>`;

  const blogPostSchema = {
    "@context": "http://schema.org",
    "@type": "BlogPosting",
  };

  const result = injectSchema(markup, blogPostSchema);

  expect(result).toEqual(`
<div id="jcComments">
    <script type="application/ld+json">{"@context":"http://schema.org","@type":"BlogPosting","comment":[{"@context":"https://schema.org","@type":"Comment","name":"Alexis","dateCreated":"2022-10-28T10:41:49+00:00","url":"https://macarthur.me/posts/dynamic-routing#comment-133"}]}</script>
</div>`);
});

it("returns markup if schema is not found", () => {
  const markup = `
<div id="jcComments">
<!-- JC:SCHEMA -->
</div>`;

  const blogPostSchema = {
    "@context": "http://schema.org",
    "@type": "BlogPosting",
  };

  const result = injectSchema(markup, blogPostSchema);

  expect(result).toEqual(markup);
});

it("returns markup if schema is not valid JSON", () => {
  const markup = `
<div id="jcComments">
    <div jc-data="jcSchema" data-schema="not-valid-json"></div>
    <!-- JC:SCHEMA -->
</div>`;

  const blogPostSchema = {
    "@context": "http://schema.org",
    "@type": "BlogPosting",
  };

  const result = injectSchema(markup, blogPostSchema);

  expect(result).toEqual(markup);
});

it("injects even when JSON is not HTML-encoded", () => {
  const markup = `
<div id="jcComments">
    <div jc-data="jcSchema" data-schema="[{"@context":"https://schema.org","@type":"Comment","name":"Alexis","dateCreated":"2022-10-28T10:41:49+00:00","url":"https://macarthur.me/posts/dynamic-routing#comment-133"}]"></div>

<!-- JC:SCHEMA -->
</div>`;

  const blogPostSchema = {
    "@context": "http://schema.org",
    "@type": "BlogPosting",
  };

  const result = injectSchema(markup, blogPostSchema);

  expect(result).toEqual(`
<div id="jcComments">
    <script type="application/ld+json">{"@context":"http://schema.org","@type":"BlogPosting","comment":[{"@context":"https://schema.org","@type":"Comment","name":"Alexis","dateCreated":"2022-10-28T10:41:49+00:00","url":"https://macarthur.me/posts/dynamic-routing#comment-133"}]}</script>
</div>`);
});
