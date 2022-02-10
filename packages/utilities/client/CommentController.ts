import { QuestClient } from "graphql-quest";
import { formatFormValues, getCurrentTime, toPrettyDate } from "./utils";
import { CREATE_COMMENT_QUERY } from "./queries";
import FocusTimer from "./FocusTimer";

export default function CommentController(shell, platform = "") {
  const { diff } = FocusTimer(shell.querySelectorAll('input, textarea'));
  const minimumSubmissionTime = 1000;
  const commentCount = shell.querySelector(
    '[data-jam-comments-component="count"]'
  );
  const commentList = shell.querySelector(
    '[data-jam-comments-component="list"]'
  );
  const message = shell.querySelector(
    '[data-jam-comments-component="message"]'
  );
  const primaryCommentBox = shell.querySelector(
    '[data-jam-comments-component="box"]'
  );
  const replyButtons = shell.querySelectorAll(
    '[data-jam-comments-component="replyButton"]'
  );
  const client = new QuestClient({
    endpoint: shell.dataset.jamCommentsServiceEndpoint,
    headers: {
      "x-api-key": shell.dataset.jamCommentsKey,
      "x-platform": platform,
    },
  });

  /**
   * Create a fresh clone of the primary comment box for use in a reply.
   *
   * @returns {HTMLElement}
   */
  const getCommentBoxClone = (inReplyToId = null) => {
    const clone = primaryCommentBox.cloneNode(true);

    clone.querySelector(
      '[data-jam-comments-component="formHeading"]'
    ).textContent = "Leave a Reply";
    clone.querySelector("form").dataset.jamCommentsInReplyTo = inReplyToId;

    return clone;
  };

  /**
   * Show a reply form under a comment, but only if one hasn't been mounted there already.
   *
   * @param {HTMLElement} comment
   * @returns {void}
   */
  const toggleReplyForm = (replyButton) => {
    const comment = replyButton.closest(
      '[data-jam-comments-component="comment"]'
    );
    const commentId = comment.dataset.jamCommentsId;
    const replyBox = comment.querySelector(
      '[data-jam-comments-component="replyBox"]'
    );
    const existingReplyBox = replyBox.querySelector(
      '[data-jam-comments-component="box"]'
    );

    if (existingReplyBox) {
      replyButton.textContent = "Reply";
      existingReplyBox.remove();
      return;
    }

    const box = getCommentBoxClone(commentId);
    replyButton.textContent = "Cancel Reply";

    replyBox.append(box);
    box.querySelector("textarea").focus();
    box
      .querySelector('[data-jam-comments-component="replyButtonItem"]')
      ?.remove();
    listenForSubmission(box.querySelector("form"));
  };

  /**
   * When a reply button is clicked, show the form for
   * leaving a reply to a comment.
   *
   * @return {void}
   */
  const listenForReplyToggle = () => {
    replyButtons.forEach((replyButton) => {
      replyButton.addEventListener("click", (e) => {
        toggleReplyForm(e.target);
      });
    });
  };

  /**
   * When textarea is focused upon, show all inputs only for the comment box that was selected.
   *
   * @return {void}
   */
  const listenForTextareaFocus = (commentBox = primaryCommentBox) => {
    commentBox.querySelector('[name="content"]').addEventListener(
      "focus",
      (e) => {
        commentBox
          .querySelectorAll(".jc-CommentBox-contactInput")
          .forEach((i) => {
            i.style.display = "flex";
          });
      },
      { once: true }
    );
  };

  /**
   * In response to a submission click event, submit a new comment to the service.
   *
   * @param {Event} e
   */
  const submitComment = (e) => {
    e.preventDefault();

    const form = e.target;
    const box = form.closest('[data-jam-comments-component="box"]');
    const startTime = getCurrentTime();
    const { content, name, emailAddress, password } = formatFormValues(form.elements);
    const loadingSvg = box.querySelector(
      "[data-jam-comments-component='loadingDots']"
    );

    const variables = {
      name,
      domain: "JAM_COMMENTS_DOMAIN",
      content,
      emailAddress,
      password,
      duration: diff(),
      parent: form.dataset.jamCommentsInReplyTo,
      path: shell.dataset.jamCommentsUrl || window.location.pathname,
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
   *
   * @param {HTMLElement} form
   */
  const cleanUpReplyBoxes = (form) => {
    form
      .closest('[data-jam-comments-component="comment"]')
      ?.querySelector('[data-jam-comments-component="replyBox"]')
      ?.remove();
  };

  /**
   * When form is submitted, send to service & respond accordingly.
   *
   * @return {void}
   */
  const listenForSubmission = (formElement = shell.querySelector("form")) => {
    formElement.addEventListener("submit", submitComment);
  };

  /**
   * Bump the number of comments listed on the page.
   *
   * @return {void}
   */
  const bumpCount = (countElement = commentCount) => {
    countElement.textContent = commentCount.textContent.replace(
      /[0-9]+/,
      function (match) {
        return parseInt(match, 10) + 1;
      }
    );
  };

  /**
   * Display a generic error message.
   *
   * @return {void}
   */
  const showError = () => {
    message.style.display = "";
    message.firstElementChild.innerText =
      "Oh no! Something went wrong while trying to submit that comment.";
  };

  /**
   * Clone list item and attach to list of comments with latest comment data.
   *
   * @return {void}
   */
  const appendComment = (commentData) => {
    const contentKeysToReplace = ["createdAt", "name", "content"];
    let commentListToAppendTo = commentList;

    commentData.createdAt = `${toPrettyDate(commentData.createdAt)} (pending)`;

    const { id } = commentData;
    const parentId = commentData.parent?.id;
    const clonedItem = commentList.querySelector("li").cloneNode(true);

    // Set the text content for each element piece.
    contentKeysToReplace.forEach((property) => {
      const node = clonedItem.querySelector(
        `[data-jam-comments-component="${property}"]`
      );
      node.innerText = commentData[property];
    });

    clonedItem.querySelector(
      '[data-jam-comments-component="anchor"]'
    ).href = `#comment-${id}`;
    clonedItem
      .querySelector('[data-jam-comments-component="replyButton"]')
      ?.remove();
    clonedItem.style.display = "";

    // This is a reply!
    if (parentId) {
      const parentCommentListItem = commentList.querySelector(
        `[data-jam-comments-id="${parentId}"]`
      ).parentNode;
      const existingRepliesList = parentCommentListItem.querySelector(
        '[data-jam-comments-component="replyList"]'
      );

      if (existingRepliesList) {
        bumpCount(
          existingRepliesList.querySelector(
            '[data-jam-comments-component="count"]'
          )
        );
      } else {
        const repliesShell = shell.cloneNode(true);
        repliesShell
          .querySelector('[data-jam-comments-component="box"]')
          .remove();
        repliesShell.firstElementChild.classList.add("jc-CommentList--replies");
        repliesShell.querySelector(
          '[data-jam-comments-component="count"]'
        ).innerText = "1 reply";
        parentCommentListItem.append(repliesShell);
      }

      parentCommentListItem
        .querySelector('[data-jam-comments-component="replyButton"]')
        ?.remove();
      commentListToAppendTo = parentCommentListItem.querySelector(
        '[data-jam-comments-component="list"]'
      );

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
