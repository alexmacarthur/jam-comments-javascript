import { Comment } from "./CommentRequest";

export const formatFormValues = (formData: FormData) =>
  Object.fromEntries(formData.entries());
export const getCurrentTime = () => new Date().getTime();
export const getTimeInMilliseconds = (): number => new Date().getTime();
export const cloneTemplate = (templateToClone: HTMLTemplateElement) =>
  templateToClone.content.cloneNode(true);

export const attachNewComment = (
  data: Comment,
  refs: any
): {
  commentNode: HTMLElement;
  replyListNode: HTMLElement | null;
} => {
  const attachNewCommentTemplate = (
    replyList: HTMLElement,
    refs: any
  ): HTMLElement => {
    const listItem = replyList.querySelector("li") as HTMLElement;
    const newCommentClone = cloneTemplate(
      refs.newCommentTemplate as HTMLTemplateElement
    );
    listItem.append(newCommentClone);

    return listItem.lastElementChild as HTMLElement;
  };

  const attachCommentListTemplate = (
    queryRoot: HTMLElement,
    refs: any
  ): HTMLUListElement => {
    const replyList = queryRoot.querySelector(
      '[data-jam-comments-component="commentList"] > ul'
    ) as HTMLElement;
    const clonedTemplate = cloneTemplate(
      refs.listItemTemplate as HTMLTemplateElement
    );
    replyList.prepend(clonedTemplate);

    return replyList as HTMLUListElement;
  };

  // This is a reply.
  if (data.parent_comment_id) {
    // Locate the parent comment.
    const parentComment = refs.shell.querySelector(
      `[data-jam-comments-id="${data.parent_comment_id}"]`
    ) as HTMLElement;
    let replyListNode = parentComment.parentElement.querySelector(
      '[data-jam-comments-component="commentList"]'
    );

    // If the parent comment does not have a reply list, create one.
    if (!replyListNode) {
      const clonedTemplate = cloneTemplate(
        refs.replyListTemplate as HTMLTemplateElement
      );
      parentComment.after(clonedTemplate);
      replyListNode = parentComment.nextElementSibling;
    }

    const replyList = attachCommentListTemplate(
      parentComment.parentElement,
      refs
    );

    return {
      commentNode: attachNewCommentTemplate(replyList, refs),
      replyListNode: replyListNode as HTMLElement,
    };
  }

  // This is a top-level comment. Just stick it on top.
  const replyList = attachCommentListTemplate(refs.shell, refs);

  return {
    commentNode: attachNewCommentTemplate(replyList, refs),
    replyListNode: null,
  };
};

export const getTokenFromCookie = (): string => {
  const cookie = (document.cookie || "")
    .split(";")
    .find((cookie) => {
      const [key] = cookie.split("=");

      return key.trim() === "jc_token";
    })
    ?.split("=")[1];

  return cookie || "";
};

export const deleteTokenFromCookie = () => {
  document.cookie = "jc_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
};

export const removeTokenFromUrl = (location = globalThis.location) => {
  const url = new URL(location.href);
  url.searchParams.delete("jc_token");

  window.history.replaceState({}, null, url.toString());
};
