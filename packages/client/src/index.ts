import {
  simpleMarkupFetcher,
  removeFalseyValues,
} from "@jam-comments/server-utilities";
import {
  CustomCopy,
  IFetchData,
} from "@jam-comments/server-utilities/dist/types/markupFetcher";

type FetchArgs = Omit<IFetchData, "copy"> & {
  copy?: CustomCopy;
};

function fetchMarkup(args: FetchArgs): Promise<string> {
  const copy = args.copy || {};

  return simpleMarkupFetcher("client")({
    ...args,
    cache: true,
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
    }),
  });
}

export function initialize(
  element: HTMLElement | string,
  args: FetchArgs
): Promise<Element> {
  return new Promise<Element>(async (resolve) => {
    const rootElement =
      typeof element === "string" ? document.querySelector(element) : element;
    const markup = await fetchMarkup(args);

    const range = document.createRange();
    range.selectNode(rootElement);
    const documentFragment = range.createContextualFragment(markup);

    rootElement.innerHTML = "";
    rootElement.append(documentFragment);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve(rootElement));
    })
  });
}
