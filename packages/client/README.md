# @jam-comments/component

A web component for embedding JamComments into a page.

```html
<script src="https://unpkg.com/@jam-comments/component"></script>

<script>
  window.commentsInitialized = () => console.log("initialized!");
</script>

<jam-comments
  data-api-key="123|your-api-key"
  data-domain="urmom.com"
  data-initialized-callback="window.commentsInitialized">
</jam-comments>
```

Further documentation can be found here: [jamcomments.com/docs/web-component](https://jamcomments.com/docs/integrations/web-component/)
