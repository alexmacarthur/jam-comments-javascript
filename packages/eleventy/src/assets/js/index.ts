import "@jam-comments/styles/dist/index.css";
import { CommentController } from "@jam-comments/client-utilities";

// Initialize each comment form found on the page. This
// should only ever be one, but you can never know.
document
  .querySelectorAll('[data-jam-comments-component="shell"]')
  .forEach((shell) => CommentController(shell, "eleventy"));
