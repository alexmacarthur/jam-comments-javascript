import styles from "@jam-comments/styles";
import CommentController from "./src/CommentController";

const style = document.createElement('style');
style.textContent = styles;

document.head.appendChild(style);

CommentController(document.getElementById('shell'), 'test-platform')
