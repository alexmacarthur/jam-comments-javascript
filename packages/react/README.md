# @jam-comments/react

A React component for rendering comments from [JamComments](https://www.jamcomments.com).

## Installation

```bash
npm install @jam-comments/react
```

## Usage

```js
import JamComments from "@jam-comments/react";

export default () => {
  const initialComments = getCommentsSomehow();

  return <JamComments initialComments={initialComments} />;
};
```
