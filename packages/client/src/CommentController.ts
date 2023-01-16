import { formatFormValues, getCurrentTime, toPrettyDate } from "./utils";
import FocusTimer from "./FocusTimer";
import DataSelector from "./DataSelector";
import CommentRequest from "./CommentRequest";
import { Comment } from "./types";

import Alpine from 'alpinejs';

window.Alpine = Alpine

Alpine.data('jcComments', () => ({
    isOpen: false,
    request: null,
    isLoading: false,
    resultMessage: "",
    resultStatus: "success",

    get resultClass() {
        return `jc-Message--${this.resultStatus}`;
    },

    init() {
        const formAttributes = this.$el.dataset;

        this.request = CommentRequest({
            endpoint: formAttributes.jamCommentsServiceEndpoint,
            apiKey: formAttributes.jamCommentsKey,
            platform: formAttributes.jamCommentsPlatform,
            path: formAttributes.jamCommentsUrl || window.location.pathname,
            domain: formAttributes.jamCommentsDomain,
        });
    },

    async submit(e: SubmitEvent) {
        e.preventDefault();

        this.isLoading = true;

        const formData = formatFormValues(new FormData(this.$el));

        try {
            await this.request.post(formData);
            this.resultMessage = "Comment successfully submitted!";
            this.resultStatus = "success";
            this.$el.reset();
        } catch(e) {
            this.resultMessage =(e as Error).message;
            this.resultStatus = "error";
        }

        this.isLoading = false;
    }
} as { 
    isOpen: boolean;
    request: ReturnType<typeof CommentRequest>;
    isLoading: boolean;
    resultMessage: string;
    resultStatus: "success" | "error";
}));

Alpine.start()

// interface ControllerParams {
//     root: HTMLElement;
// }

// export default function CommentController({ root }: ControllerParams) {
//     const { diff } = FocusTimer(root.querySelectorAll("input, textarea"));
//     const { select, selectAll } = DataSelector(root, "jam-comments-component");
//     const minimumSubmissionTime = 1000;
//     const commentCount = select("count");
//     const commentList = select("list");
//     const message = select("message");
//     const primaryCommentBox = select("commentBox");
//     const replyButtons = selectAll("replyButton");
//     const request = CommentRequest({
//         endpoint: root.dataset.jamCommentsServiceEndpoint!,
//         apiKey: root.dataset.jamCommentsKey!,
//         platform: root.dataset.jamCommentsPlatform!,
//         path: root.dataset.jamCommentsUrl || window.location.pathname,
//         domain: root.dataset.jamCommentsDomain!,
//     });

//     /**
//      * Create a fresh clone of the primary comment box for use in a reply.
//      */
//     const getCommentBoxClone = (inReplyToId?: string) => {
//         const clone = primaryCommentBox.cloneNode(true) as HTMLElement;

//         select("formHeading", clone).textContent = "Leave a Reply";
//         clone.querySelector("form")!.dataset.jamCommentsInReplyTo = inReplyToId;

//         return clone;
//     };

//     /**
//      * Show a reply form under a comment, but only if one hasn't been mounted there already.
//      */
//     const toggleReplyForm = (replyButton: HTMLElement) => {
//         const comment = replyButton.closest(
//             '[data-jam-comments-component="comment"]'
//         ) as HTMLElement;
//         const commentId = comment.dataset.jamCommentsId;
//         const replyBox = select("replyBox", comment);
//         const existingReplyBox = select("commentBox", replyBox as HTMLElement);

//         if (existingReplyBox) {
//             replyButton.textContent = "Reply";
//             existingReplyBox.remove();
//             return;
//         }

//         const box = getCommentBoxClone(commentId);
//         replyButton.textContent = "Cancel Reply";

//         replyBox.append(box);
//         box.querySelector("textarea")!.focus();
//         select("replyButtonItem", box)?.remove();
//         listenForSubmission(box.querySelector("form")!);
//     };

//     /**
//      * When a reply button is clicked, show the form for
//      * leaving a reply to a comment.
//      */
//     const listenForReplyToggle = () => {
//         replyButtons.forEach((replyButton) => {
//             replyButton.addEventListener("click", (e) => {
//                 toggleReplyForm(e.target as HTMLElement);
//             });
//         });
//     };

//     /**
//      * When textarea is focused upon, show all inputs only for the comment box that was selected.
//      */
//     const listenForTextareaFocus = () => {
//         primaryCommentBox.querySelector('[name="content"]')!.addEventListener(
//             "focus",
//             () => {
//                 primaryCommentBox
//                     .querySelectorAll(".jc-CommentBox-contactInput")
//                     .forEach((i) => {
//                         (i as HTMLElement).style.display = "flex";
//                     });
//             },
//             { once: true }
//         );
//     };

//     /**
//      * In response to a submission click event, submit a new comment to the service.
//      */
//     const submitComment = async (e) => {
//         hideMessage();
//         e.preventDefault();

//         const form = e.target;
//         const box = form.closest('[data-jam-comments-component="box"]');
//         const startTime = getCurrentTime();
//         const { content, name, email_address, password } = formatFormValues(
//             form.elements
//         );
//         const loadingSvg = select("loadingDots", box);
//         const replyId = Number(e.target.dataset.jamCommentsInReplyTo);

//         try {
//             const { data } = await request.post({
//                 name,
//                 email_address,
//                 content,
//                 parent_comment_id: replyId ? replyId : null,
//                 // diff: diff(),
//             });

//             // Show the loading dots.
//             loadingSvg.style.display = "";

//             const remaining =
//                 minimumSubmissionTime - (getCurrentTime() - startTime);
//             const delay = remaining > 0 ? remaining : 0;

//             setTimeout(() => {
//                 loadingSvg.style.display = "none";
//                 appendComment(data);
//                 cleanUpReplyBoxes(form);
//                 bumpCount();
//                 form.reset();
//                 showSuccess("Comment successfully submitted!");
//             }, delay);
//         } catch (e) {
//             console.error(e);
//             loadingSvg.style.display = "none";
//             return showError((e as Error).message);
//         }
//     };

//     /**
//      * Remove the reply form from the comment that just received a reply.
//      */
//     const cleanUpReplyBoxes = (form) => {
//         select(
//             "replyBox",
//             form.closest('[data-jam-comments-component="comment"]')
//         )?.remove();
//     };

//     /**
//      * When form is submitted, send to service & respond accordingly.
//      */
//     const listenForSubmission = (formElement = root.querySelector("form")!) => {
//         formElement.addEventListener("submit", submitComment);
//     };

//     /**
//      * Bump the number of comments listed on the page.
//      */
//     const bumpCount = (countElement = commentCount) => {
//         countElement.textContent = commentCount.textContent!.replace(
//             /[0-9]+/,
//             (match) => String(parseInt(match, 10) + 1)
//         );
//     };

//     /**
//      * Display a generic error message.
//      *
//      * @return {void}
//      */
//     const showError = (
//         messageText = "Oh no! Something went wrong while trying to submit that comment."
//     ) => {
//         message.classList.remove("jc-Message--success");
//         message.classList.add("jc-Message--error");
//         message.style.display = "";
//         (message.firstElementChild as HTMLElement).innerText = messageText;
//     };

//     /**
//      * Display a generic success message.
//      *
//      * @return {void}
//      */
//     const showSuccess = (messageText: string) => {
//         message.classList.remove("jc-Message--error");
//         message.classList.add("jc-Message--success");
//         message.style.display = "";
//         (message.firstElementChild as HTMLElement).innerText = messageText;
//     };


//     /**
//      * Hide the error message.
//      *
//      * @returns {void}
//      */
//     const hideMessage = () => (message.style.display = "none");

//     /**
//      * Clone list item and attach to list of comments with latest comment data.
//      */
//     const appendComment = (commentData: Comment) => {
//         const contentKeysToReplace = ["created_at", "name", "content"];
//         let commentListToAppendTo = commentList;

//         commentData.created_at = `${toPrettyDate(
//             commentData.created_at
//         )} (pending)`;

//         const { id } = commentData;
//         const parentId = commentData.parent_comment_id;
//         const clonedItem = commentList
//             .querySelector("li")!
//             .cloneNode(true) as HTMLElement;

//         // Set the text content for each element piece.
//         contentKeysToReplace.forEach((property) => {
//             const node = clonedItem.querySelector(
//                 `[data-jam-comments-component="${property}"]`
//             ) as HTMLElement;
//             node.innerText = commentData[property];
//         });

//         (select("anchor", clonedItem) as any).href = `#comment-${id}`;
//         select("replyButton", clonedItem)?.remove();
//         clonedItem.style.display = "";

//         // This is a reply!
//         if (parentId) {
//             const parentCommentListItem = commentList.querySelector(
//                 `[data-jam-comments-id="${parentId}"]`
//             )!.parentNode as HTMLElement;
//             const existingRepliesList = select(
//                 "replyList",
//                 parentCommentListItem
//             );

//             if (existingRepliesList) {
//                 bumpCount(
//                     existingRepliesList.querySelector(
//                         '[data-jam-comments-component="count"]'
//                     ) as HTMLElement
//                 );
//             } else {
//                 const repliesShell = root.cloneNode(true) as HTMLElement;
//                 select("commentBox", repliesShell).remove();
//                 repliesShell.firstElementChild!.classList.add(
//                     "jc-CommentList--replies"
//                 );
//                 select("count", repliesShell).innerText = "1 reply";
//                 parentCommentListItem.append(repliesShell);
//             }

//             select("replyButton", parentCommentListItem)?.remove();
//             commentListToAppendTo = select("list", parentCommentListItem);

//             if (!existingRepliesList) {
//                 commentListToAppendTo.innerHTML = "";
//             }
//         }

//         commentListToAppendTo.insertBefore(
//             clonedItem,
//             commentListToAppendTo.firstChild
//         );
//     };

//     listenForReplyToggle();
//     listenForSubmission();
//     listenForTextareaFocus();
// }
