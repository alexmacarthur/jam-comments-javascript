import "../scss/style.scss";
import { CommentController } from "jam-comments-utilities";

// Initialize each comment form found on the page.
[
  ...document.querySelectorAll('[data-jam-comments-component="shell"]'),
].forEach((shell) => CommentController(shell));
