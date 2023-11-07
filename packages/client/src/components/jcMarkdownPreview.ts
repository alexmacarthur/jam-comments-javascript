import MarkdownPreviewRequest from "../requests/MarkdownPreviewRequest";
import { BaseFormAttributes } from "../types";

export default () => ({
  isShowingPreview: false,
  preview: "",

  init() {
    this.markdownPreviewRequest = MarkdownPreviewRequest({
      endpoint: this.baseDataAttributes.jamCommentsMarkdownPreviewEndpoint,
      apiKey: this.baseDataAttributes.jamCommentsKey,
    });
  },

  get baseDataAttributes(): BaseFormAttributes {
    return { ...(this.$refs.shell.dataset as BaseFormAttributes) };
  },

  async previewMarkdown(e: InputEvent) {
    this.isShowingPreview = true;
    this.preview = "";

    if (this.controller) {
      this.controller.abort();
      this.controller = null;
    }

    const content = this.$refs.content.value;

    if (!content) {
      this.preview = "Nothing to preview!";
      return;
    }

    this.controller = new AbortController();
    const signal = this.controller.signal;

    this.preview = await this.markdownPreviewRequest(content, signal);
  },
});
