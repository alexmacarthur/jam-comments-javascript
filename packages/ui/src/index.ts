import "@jam-comments/styles";
import CommentController from "./CommentController";

const root = document.querySelector('.jc-Shell') as HTMLElement;

new CommentController({
    root, 
    platform: ""
});
