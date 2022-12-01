import CommentController from "./CommentController";

const JamCommentsMap = new Map();

export const initialize = (root: HTMLElement | Element): typeof CommentController => {
    if(JamCommentsMap.has(root)) {
        return JamCommentsMap.get(root);
    }

    const controllerInstance = new CommentController({
        root: root as HTMLElement,
    });

    JamCommentsMap.set(root, controllerInstance);

    return controllerInstance;
}

