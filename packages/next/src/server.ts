import {
  markupFetcher,
  removeFalseyValues,
  CustomCopy,
} from "@jam-comments/server-utilities";
import { IFetchData } from "@jam-comments/server-utilities/dist/types/markupFetcher";

type FetchArgs = Omit<IFetchData, "copy"> & {
  copy?: CustomCopy;
};

export const fetchMarkup = function (args: FetchArgs) {
  const copy = args.copy || {};

  return markupFetcher("next")({
    ...args,
    copy: removeFalseyValues({
      copy_confirmation_message: copy.confirmationMessage,
      copy_submit_button: copy.submitButton,
      copy_name_placeholder: copy.namePlaceholder,
      copy_email_placeholder: copy.emailPlaceholder,
      copy_comment_placeholder: copy.commentPlaceholder,
      copy_write_tab: copy.writeTab,
      copy_preview_tab: copy.previewTab,
      copy_auth_button: copy.authButton,
      copy_log_out_button: copy.logOutButton,
      copy_reply_button: copy.replyButton,
      copy_name_label: copy.nameLabel,
      copy_email_label: copy.emailLabel,
    }),
  });
};
