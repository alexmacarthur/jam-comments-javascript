import CommentController from "./CommentController";

export const initialize = (root) => {
    return new CommentController({
        root,
    });
}

