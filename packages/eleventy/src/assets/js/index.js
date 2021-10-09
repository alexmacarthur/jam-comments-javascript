import "@jam-comments/styles";
import { CommentController } from "@jam-comments/utilities/client";

// Initialize each comment form found on the page.
document
  .querySelectorAll('[data-jam-comments-component="shell"]')
  .forEach((shell) => CommentController(shell, "eleventy"));
