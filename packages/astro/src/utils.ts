import nodeFetch from "node-fetch";
import { AstroGlobal } from "astro";
import { JamCommentsProps } from "..";
import { logError, markupFetcher } from "@jam-comments/server-utilities";

export function getCurrentPath(astro: AstroGlobal) {
  return new URL(astro.request.url).pathname;
}

export function removeFalseyValues<T>(obj: T): Partial<T> {
  const filteredItems = Object.entries(obj).filter(([, value]) => value);

  return Object.fromEntries(filteredItems) as Partial<T>;
}

const fetchMarkup = markupFetcher("astro", nodeFetch as any);

export async function fetchCommentData(
  {
    copy,
    tz = undefined,
    path = undefined,
    schema = undefined,
    dateFormat = undefined,
    domain = import.meta.env.JAM_COMMENTS_DOMAIN as string,
    apiKey = import.meta.env.JAM_COMMENTS_API_KEY as string,
    baseUrl = import.meta.env.JAM_COMMENTS_BASE_URL as string,
    environment = import.meta.env.JAM_COMMENTS_ENVIRONMENT as string,
  }: JamCommentsProps,
  fetchFunc = fetchMarkup,
) {
  try {
    return fetchFunc({
      path,
      schema,
      domain,
      apiKey,
      baseUrl,
      environment,
      dateFormat,
      tz,
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
  } catch (e) {
    logError(e as string);
    return null;
  }
}
