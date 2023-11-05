import CommentRequest, { Comment } from "../requests/CommentRequest";
import MarkdownPreviewRequest from "../requests/MarkdownPreviewRequest";
import { attachNewComment, formatFormValues } from "../utils";

interface BaseFormAttributes {
  jamCommentsServiceEndpoint: string;
  jamCommentsKey: string;
  jamCommentsPlatform: string;
  jamCommentsUrl: string;
  jamCommentsDomain: string;
}

export default (openByDefault = false) =>
  ({
    isOpen: openByDefault,
    request: null,
    isLoading: false,
    resultMessage: "",
    isShowingPreview: false,
    preview: "",
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
        endpoint:
          this.baseDataAttributes
            .jamCommentsServiceEnMarkdownPreviewRequestdpoint,
        apiKey: this.baseDataAttributes.jamCommentsKey,
        platform: this.baseDataAttributes.jamCommentsPlatform,
        path:
          this.baseDataAttributes.jamCommentsPath || window.location.pathname,
        domain: this.baseDataAttributes.jamCommentsDomain,
        should_stub: !!this.baseDataAttributes.jamCommentsShouldStub,
      });

      this.markdownPreviewRequest = MarkdownPreviewRequest({
        endpoint: this.baseDataAttributes.jamCommentsMarkdownPreviewEndpoint,
        apiKey: this.baseDataAttributes.jamCommentsKey,
      });
    },

    async previewMarkdown(e: InputEvent) {
      this.isShowingPreview = true;

      const content = this.$refs.content.value;

      if (!content) return;

      const preview = await this.markdownPreviewRequest(content);

      console.log(preview);

      this.preview = preview;

      // const preview = this.$refs.preview as HTMLElement;

      // preview.innerHTML = await this.request.previewMarkdown(textarea.value);
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
