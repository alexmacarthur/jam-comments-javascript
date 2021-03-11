import React, { useRef, useState } from "react";
import Message from "./Message";
import formInputsToValues from "../utils/formInputsToValues";
import LoadingDots from "../assets/loading-dots.svg";
import useIsMounted from "../utils/useIsMounted";
import getClient from "../getClient";
import { CREATE_COMMENT as CREATE_COMMENT_QUERY } from "../queries";

const getCurrentTime = () => new Date().getTime();
const minimumSubmissionTime = 1000;

type CommentBoxProps = {
  newComment: any;
  domain: string;
  apiKey: string;
};

export default ({ newComment, domain, apiKey }: CommentBoxProps) => {
  const isMounted = useIsMounted();
  const formRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrorMessage, setFormError] = useState("");
  const [formSuccessMessage, setFormSuccess] = useState("");
  const [shouldShowFullForm, setShouldShowFullForm] = useState(false);

  const submitComment = async (e) => {
    e.preventDefault();

    const client = getClient(apiKey);
    const startTime = getCurrentTime();

    setFormError("");
    setIsSubmitting(true);

    let mutationParams = formInputsToValues(formRef.current);

    formRef.current.reset();

    const { name, content, emailAddress } = mutationParams;

    const variables = {
      name,
      domain,
      content,
      emailAddress,
      path: window.location.pathname,
    };

    let response;

    try {
      response = await client.send(CREATE_COMMENT_QUERY, variables);

      if (response?.errors?.length) {
        console.error(response.errors[0].message);
        setFormError("Sorry, something went wrong!");
        return;
      }

      setFormSuccess("Comment submitted!");
    } catch (e) {
      setFormError("Sorry, something went wrong!");
      setIsSubmitting(false);
    } finally {
      const remaining = minimumSubmissionTime - (getCurrentTime() - startTime);
      const delay = remaining > 0 ? remaining : 0;

      setTimeout(() => {
        if (!isMounted.current) return;

        setIsSubmitting(false);

        if (response?.data?.createComment) {
          newComment(response.data.createComment);
        }
      }, delay);
    }
  };

  return (
    <div className="jc-CommentBox">
      {isSubmitting && (
        <div className="jc-CommentBox-loadingDots">
          <LoadingDots />
        </div>
      )}

      <div
        className={`jc-CommentBox-inputs ${
          isSubmitting ? "is-submitting" : ""
        }`}
      >
        <h3>Leave a Comment</h3>

        {formErrorMessage && <Message>{formErrorMessage}</Message>}
        {formSuccessMessage && (
          <Message isSuccessful={true}>{formSuccessMessage}</Message>
        )}

        <form
          onSubmit={submitComment}
          ref={formRef}
          className={"jc-CommentBox-form"}
        >
          <label className={"jc-CommentBox-label jc-CommentBox-textarea"}>
            <textarea
              name="content"
              required={true}
              onFocus={() => !shouldShowFullForm && setShouldShowFullForm(true)}
            ></textarea>

            <small className="jc-CommentBox-attribution">
              Powered by{" "}
              <a
                tabIndex={"-1" as any}
                href="https://jamcomments.com"
                rel="noreferrer noopener"
                target="_blank"
              >
                JamComments
              </a>
            </small>
          </label>

          {shouldShowFullForm && (
            <>
              <label className={"jc-CommentBox-label"}>
                Name
                <input type="text" name="name" required={true} />
              </label>

              <label className={"jc-CommentBox-label"}>
                Email Address
                <input type="email" name="emailAddress" />
              </label>

              <span className={"jc-CommentBox-buttonWrapper"}>
                <button className={"jc-CommentBox-button"}>Submit</button>
              </span>
            </>
          )}
        </form>
      </div>
    </div>
  );
};
