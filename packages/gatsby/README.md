# @jam-comments/gatsby

The official Gatsby plugin for integrating [JamComments](https://jamcomments.com) into your Gatsby application.

## Setup

1. Create a JamComments account.
2. Create a site and generate an API key.
3. Install this plugin: `npm install @jam-comments/gatsby`.
4. Configure the plugin by adding the following to your `gatsby-node.js`:

```js
resolve: '@jam-comments/gatsby',
  options: {
    api_key: "YOUR-API-KEY",
    domain: "your-domain.me"
  }
},
```

## Usage

### Embedding Comments

To include a comment form and existing comments on your blog posts, you'll need to place the `<JamComments />` component on your page component(s), along with the required `path` and `pageContext` props:

```jsx
import React from "react";
import JamComments from "@jam-comments/gatsby";

const MyPost = (props) => {
  return (
    <article>
      <h1>{props.title}</h1>
      <div>{props.content}</div>
      <JamComments
        path={props.path}
        pageContext={props.pageContext}
        apiKey={apiKey}
        domain={domain}
      />
    </article>
  );
};

export default MyPost;
```

### Querying for Data

```graphql
{
  allJamComment(limit: 10) {
    edges {
      node {
        content
        name
        path
        id
      }
    }
  }
}
```
