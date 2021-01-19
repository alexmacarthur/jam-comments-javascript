# @jam-comments/react

A React component for rendering comments from [JamComments](https://www.jamcomments.com).

## Installation

```bash
npm install @jam-comments/react
```

## Usage

```javascript
import JamComments from "@jam-comments/react";

export default () => {
  const initialComments = getCommentsSomehow();
  const apiKey = "getthisfromthejamcommentsadmin";
  const domain = "yourdomain.com";

  return (
    <JamComments
      initialComments={initialComments}
      apiKey={apiKey}
      domain={domain}
    />
  );
};
```
