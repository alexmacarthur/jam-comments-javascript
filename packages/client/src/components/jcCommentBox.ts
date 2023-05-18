import CommentRequest, { Comment } from "../CommentRequest";
import { attachNewComment, formatFormValues } from "../utils";

interface BaseFormAttributes {
  jamCommentsServiceEndpoint: string;
  jamCommentsKey: string;
  jamCommentsPlatform: string;
  jamCommentsUrl: string;
  jamCommentsDomain: string;
}

export default () =>
  ({
    isOpen: false,
    request: null,
    isLoading: false,
    resultMessage: "",
    resultStatus: "success",
    startTime: null,

    get resultClass() {
      return `jc-Message--${this.resultStatus}`;
    },

    get baseDataAttributes(): BaseFormAttributes {
      return { ...(this.$refs.shell.dataset as BaseFormAttributes) };
    },

    get parentCommentId(): number | null {
      if (!this.$refs.comment) return null;

      return Number(this.$refs.comment.dataset.jamCommentsId);
    },

    get currentTime() {
      return new Date().getTime() / 1000;
    },

    init() {
      this.request = CommentRequest({
        endpoint: this.baseDataAttributes.jamCommentsServiceEndpoint,
        apiKey: this.baseDataAttributes.jamCommentsKey,
        platform: this.baseDataAttributes.jamCommentsPlatform,
        path:
          this.baseDataAttributes.jamCommentsUrl || window.location.pathname,
        domain: this.baseDataAttributes.jamCommentsDomain,
      });
    },

    async submit(e: SubmitEvent) {
      e.preventDefault();

      this.isLoading = true;

      const formData = formatFormValues(new FormData(this.$el));

      if (this.parentCommentId) {
        formData.parent_comment_id = this.parentCommentId;
      }

      if (this.startTime) {
        formData.time_to_comment = String(this.currentTime - this.startTime);
      }

      try {
        const { data }: { data: Comment } = await this.request.post(formData);

        this.resultMessage = "Comment successfully submitted!";
        this.resultStatus = "success";
        this.count++;
        this.$el.reset();

        const { commentNode, replyListNode } = attachNewComment(
          data,
          this.$refs
        );

        this.$nextTick(() => {
          // Only necessary for replies.
          if (replyListNode) {
            replyListNode.dispatchEvent(new CustomEvent("jc-update-count"));
          }

          this.hydrateNewComment(commentNode, data);
        });
      } catch (e) {
        console.error(e);
        this.resultMessage = (e as Error).message;
        this.resultStatus = "error";
      }

      this.isLoading = false;
    },

    hydrateNewComment(commentNode: HTMLElement, data) {
      commentNode.dispatchEvent(
        new CustomEvent("jc-new-comment", {
          bubbles: true,
          detail: data,
        })
      );
    },
  } as {
    isOpen: boolean;
    request: ReturnType<typeof CommentRequest>;
    isLoading: boolean;
    resultMessage: string;
    resultStatus: "success" | "error";
  });
