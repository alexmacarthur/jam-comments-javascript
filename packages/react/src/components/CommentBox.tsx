import React, { useRef, useState, useEffect } from "react";
import Message from "./Message";
import formInputsToValues from "../utils/formInputsToValues";
import LoadingDots from "./LoadingDots";
import useIsMounted from "../utils/useIsMounted";
import getClient from "../getClient";
import { CREATE_COMMENT_QUERY } from "@jam-comments/utilities/client";
import { getTimeInMilliseconds } from "@jam-comments/utilities/shared";
import useFocusTimer from "../utils/useFocusTimer";

const MINIMUM_SUBMISSION_TIME = 1000;

export default ({
  newComment,
  domain,
  apiKey,
  platform,
  parent = null,
  forceFormOpen = false,
  onSubmission = () => {},
}: CommentBoxProps) => {
  const isReply = parent !== null;
  const isMounted = useIsMounted();
  const formRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrorMessage, setFormError] = useState("");
  const [formSuccessMessage, setFormSuccess] = useState("");
  const [shouldShowFullForm, setShouldShowFullForm] = useState(false);
  const diff = useFocusTimer(formRef);

  const postSubmissionTimeRemaining = (startTime): number => {
    const remaining =
      MINIMUM_SUBMISSION_TIME - (getTimeInMilliseconds() - startTime);
    return remaining > 0 ? remaining : 0;
  };

  const submitComment = async (e) => {
    e.preventDefault();

    const client = getClient(apiKey, platform);
    const startTime = getTimeInMilliseconds();

    setFormError("");
    setIsSubmitting(true);

    const { name, content, emailAddress, password } = formInputsToValues(
      formRef.current
    );
    const variables = {
      name,
      domain,
      content,
      emailAddress,
      parent,
      path: window.location.pathname,
      password,
      duration: diff(),
    };

    formRef.current.reset();

    try {
      const response = await client.send(CREATE_COMMENT_QUERY, variables);

      if (response?.errors?.length) {
        throw response.errors[0].message;
      }

      setTimeout(() => {
        if (!isMounted.current) return;

        setFormSuccess("Comment submitted!");
        setIsSubmitting(false);
        newComment(response.data.createComment);
        onSubmission(response.data.createComment);
      }, postSubmissionTimeRemaining(startTime));
    } catch (e: any) {
      console.error(e.message);
      onSubmission(null);
      setIsSubmitting(false);
      setFormError("Sorry, something went wrong!");
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
        <h3 className="jc-CommentBox-heading">
          Leave a {isReply ? "Reply" : "Comment"}
        </h3>

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

          <label className="block jc-Password">
            Password:
            <br />
            <input
              type="text"
              name="password"
              tabIndex={-1}
              autoComplete="off"
            />
          </label>

          {(shouldShowFullForm || forceFormOpen) && (
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
                <button
                  className={"jc-CommentBox-button"}
                  disabled={isSubmitting}
                >
                  Submit
                </button>
              </span>
            </>
          )}
        </form>
      </div>
    </div>
  );
};
