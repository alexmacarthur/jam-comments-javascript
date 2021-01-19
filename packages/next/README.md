# @jam-comments/react

Set up your [Next.js](https://nextjs.org/) site with [JamComments](https://www.jamcomments.com).

## Installation

```bash
npm install @jam-comments/next
```

## Usage

```js
// [slug].js

import { JamComments } from "@jam-comments/next";

export default function Post({ content, comments, jamCommentsDomain, jamCommentsApiKey}) {
  return (
    <article>
      <div dangerouslySetInnerHTML={{__html: content}}></div>

      <JamComments
        comments={comments}
        domain={jamCommentsDomain}
        apiKey={jamCommentsApiKey}
      />
    </article>
  )
}

export async function getStaticProps() {
  const content = await getContentFromSomewhere();
  const { fetchByPath } = require("@jam-comments/next");

  const comments = await fetchByPath({
    domain: process.env.JAM_COMMENTS_DOMAIN,
    apiKey: process.env.JAM_COMMENTS_API_KEY,
    path: "/posts/when-dom-updates-appear-to-be-asynchronous"
  });

  return {
    props: {
      jamCommentsApiKey: process.env.JAM_COMMENTS_API_KEY,
      jamCommentsDomain: process.env.JAM_COMMENTS_DOMAIN,
      comments,
      content
    },
  };
}

```
