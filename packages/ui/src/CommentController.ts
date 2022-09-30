import { QuestClient } from "graphql-quest";
import { formatFormValues, getCurrentTime, toPrettyDate } from "./utils";
import { CREATE_COMMENT_QUERY } from "./queries";
import FocusTimer from "./FocusTimer";
import DataSelector from "./DataSelector";

declare global {
  interface Element {
    all: () => NodeListOf<HTMLElement>, 
  }
}

interface ControllerParams {
  root: HTMLElement, 
  platform: string
}

export default function CommentController({ root, platform}: ControllerParams) {
  const { diff } = FocusTimer(root.querySelectorAll('input, textarea'));
  const { select, selectAll } = DataSelector(root, "jam-comments-component");
  const minimumSubmissionTime = 1000;
  const commentCount = select("count");
  const commentList = select("list");
  const message = select("message");
  const primaryCommentBox = select("commentBox");
  const replyButtons = selectAll("replyButton");
  const client = QuestClient({
    endpoint: root.dataset.jamCommentsServiceEndpoint,
    headers: {
      "x-api-key": root.dataset.jamCommentsKey,
      "x-platform": platform,
    },
  });

  /**
   * Create a fresh clone of the primary comment box for use in a reply.
   */
  const getCommentBoxClone = (inReplyToId?: string) => {
    const clone = primaryCommentBox.cloneNode(true) as HTMLElement;

    select("formHeading", clone).textContent = "Leave a Reply";
    clone.querySelector("form").dataset.jamCommentsInReplyTo = inReplyToId;

    return clone;
  };

  /**
   * Show a reply form under a comment, but only if one hasn't been mounted there already.
   */
  const toggleReplyForm = (replyButton: HTMLElement) => {
    const comment = replyButton.closest(
      '[data-jam-comments-component="comment"]'
    ) as HTMLElement;
    const commentId = comment.dataset.jamCommentsId;
    const replyBox = select("replyBox", comment);
    console.log(comment, replyBox);
    const existingReplyBox = select("commentBox", replyBox);

    if (existingReplyBox) {
      replyButton.textContent = "Reply";
      existingReplyBox.remove();
      return;
    }

    const box = getCommentBoxClone(commentId);
    replyButton.textContent = "Cancel Reply";

    replyBox.append(box);
    box.querySelector("textarea").focus();
    select("replyButtonItem", box)?.remove();
    listenForSubmission(box.querySelector("form"));
  };

  /**
   * When a reply button is clicked, show the form for
   * leaving a reply to a comment.
   */
  const listenForReplyToggle = () => {
    replyButtons.forEach((replyButton) => {
      replyButton.addEventListener("click", (e) => {
        toggleReplyForm(e.target as HTMLElement);
      });
    });
  };

  /**
   * When textarea is focused upon, show all inputs only for the comment box that was selected.
   */
  const listenForTextareaFocus = () => {
    primaryCommentBox.querySelector('[name="content"]').addEventListener(
      "focus",
      () => {
        primaryCommentBox
          .querySelectorAll(".jc-CommentBox-contactInput")
          .forEach((i) => {
            (i as HTMLElement).style.display = "flex";
          });
      },
      { once: true }
    );
  };

  /**
   * In response to a submission click event, submit a new comment to the service.
   */
  const submitComment = (e) => {
    e.preventDefault();

    const form = e.target;
    const box = form.closest('[data-jam-comments-component="box"]');
    const startTime = getCurrentTime();
    const { content, name, emailAddress, password } = formatFormValues(form.elements);
    const loadingSvg = select("loadingDots", box);

    const variables = {
      name,
      domain: "JAM_COMMENTS_DOMAIN",
      content,
      emailAddress,
      password,
      duration: diff(),
      parent: form.dataset.jamCommentsInReplyTo,
      path: root.dataset.jamCommentsUrl || window.location.pathname,
    };

    // Show the loading dots.
    loadingSvg.style.display = "";

    client.send(CREATE_COMMENT_QUERY, variables).then((result) => {
      const remaining = minimumSubmissionTime - (getCurrentTime() - startTime);
      const delay = remaining > 0 ? remaining : 0;

      if (result.errors || !result.data) {
        loadingSvg.style.display = "none";
        return showError();
      }

      setTimeout(() => {
        loadingSvg.style.display = "none";
        appendComment(result.data.createComment);
        cleanUpReplyBoxes(form);
        bumpCount();
        form.reset();
      }, delay);
    });
  };

  /**
   * Remove the reply form from the comment that just received a reply.
   */
  const cleanUpReplyBoxes = (form) => {
    select("replyBox", form
      .closest('[data-jam-comments-component="comment"]'))?.remove();
  };

  /**
   * When form is submitted, send to service & respond accordingly.
   */
  const listenForSubmission = (formElement = root.querySelector("form")) => {
    formElement.addEventListener("submit", submitComment);
  };

  /**
   * Bump the number of comments listed on the page.
   */
  const bumpCount = (countElement = commentCount) => {
    countElement.textContent = commentCount.textContent.replace(
      /[0-9]+/,
      (match) => String(parseInt(match, 10) + 1)
    );
  };

  /**
   * Display a generic error message.
   *
   * @return {void}
   */
  const showError = () => {
    message.style.display = "";
    (message.firstElementChild as HTMLElement).innerText =
      "Oh no! Something went wrong while trying to submit that comment.";
  };

  /**
   * Clone list item and attach to list of comments with latest comment data.
   */
  const appendComment = (commentData) => {
    const contentKeysToReplace = ["createdAt", "name", "content"];
    let commentListToAppendTo = commentList;

    commentData.createdAt = `${toPrettyDate(commentData.createdAt)} (pending)`;

    const { id } = commentData;
    const parentId = commentData.parent?.id;
    const clonedItem = commentList.querySelector("li").cloneNode(true) as HTMLElement;

    // Set the text content for each element piece.
    contentKeysToReplace.forEach((property) => {
      const node = clonedItem.querySelector(
        `[data-jam-comments-component="${property}"]`
      ) as HTMLElement;
      node.innerText = commentData[property];
    });

    (select("anchor", clonedItem) as any).href = `#comment-${id}`;
    select("replyButton", clonedItem)?.remove();
    clonedItem.style.display = "";

    // This is a reply!
    if (parentId) {
      const parentCommentListItem = commentList.querySelector(
        `[data-jam-comments-id="${parentId}"]`
      ).parentNode as HTMLElement;
      const existingRepliesList = select("replyList", parentCommentListItem);

      if (existingRepliesList) {
        bumpCount(
          existingRepliesList.querySelector(
            '[data-jam-comments-component="count"]'
          )
        );
      } else {
        const repliesShell = root.cloneNode(true) as HTMLElement;
        select("commentBox", repliesShell).remove();
        repliesShell.firstElementChild.classList.add("jc-CommentList--replies");
        select("count", repliesShell).innerText = "1 reply";
        parentCommentListItem.append(repliesShell);
      }

      select("replyButton", parentCommentListItem)?.remove();
      commentListToAppendTo = select("list", parentCommentListItem);

      if (!existingRepliesList) {
        commentListToAppendTo.innerHTML = "";
      }
    }

    commentListToAppendTo.insertBefore(
      clonedItem,
      commentListToAppendTo.firstChild
    );
  };

  listenForReplyToggle();
  listenForSubmission();
  listenForTextareaFocus();
}
