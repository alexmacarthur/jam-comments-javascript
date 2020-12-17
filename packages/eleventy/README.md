# eleventy-plugin-jam-comments

The official plugin for integrating [JamComments](https://jamcomments.com) into your Eleventy site.

## Prerequisites

In order to use this plugin, you'll need a JamComments account, where you'll also need to have created a site and generated an API key.

## Installation

Run `npm install eleventy-plugin-jam-comments`.

## Configuration

In your `.eleventy.js` file, require the plugin and initialize it with your site's domain and API key.

```js
const jamComments = require('eleventy-plugin-jam-comments');

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(jamComments, {
    domain: process.env.JAM_COMMENTS_DOMAIN,
    apiKey: process.env.JAM_COMMENTS_API_KEY
  });
});
```

## Displaying Comments

Embed the following Nunjucks shortcode in the template that renders individual posts or pages.

```
{% jamcomments %}
```

## Supported Rendering Engines

- \*.njk
- \*.liquid
