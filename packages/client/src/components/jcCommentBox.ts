import CommentRequest, { Comment } from "../requests/CommentRequest";
import { BaseFormAttributes } from "../types";
import { attachNewComment, formatFormValues } from "../utils";

export default (openByDefault: any = false) =>
  ({
    isOpen: openByDefault,
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
      this.commentRequest = CommentRequest({
        endpoint: this.baseDataAttributes.jamCommentsServiceEndpoint,
        apiKey: this.baseDataAttributes.jamCommentsKey,
        platform: this.baseDataAttributes.jamCommentsPlatform,
        path:
          this.baseDataAttributes.jamCommentsPath || window.location.pathname,
        domain: this.baseDataAttributes.jamCommentsDomain,
        should_stub: !!this.baseDataAttributes.jamCommentsShouldStub,
      });
    },

    async submit(e: SubmitEvent) {
      this.isLoading = true;

      const formData = formatFormValues(new FormData(this.$el));

      if (this.parentCommentId) {
        formData.parent_comment_id = this.parentCommentId;
      }

      if (this.startTime) {
        formData.time_to_comment = String(this.currentTime - this.startTime);
      }

      try {
        const { data }: { data: Comment } = await this.commentRequest.post(
          formData
        );

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
