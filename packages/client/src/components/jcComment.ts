export default () => ({
  
  get id() {
    return this.$root.dataset.jamCommentsId;
  },

  openReplyForm() {
    const template = this.$refs.replyFormTemplate as HTMLTemplateElement;
    this._getAllReplyForms().forEach((replyForm) => replyForm.remove());
    this.$root.append(template.content.cloneNode(true));
  },

  _getAllReplyForms() {
    return this.$refs.shell.querySelectorAll(
      '[data-jam-comments-component="replyForm"]'
    );
  },
});
