import React, { useRef, useState } from "react";
import Message from "../Message";
import "./styles.scss";
import formInputsToValues from "../../utils/formInputsToValues";
import LoadingDots from "../../assets/loading-dots.svg";
import useIsMounted from "../../utils/useIsMounted";
import client from "./questClient";

const domain = process.env.GATSBY_JAM_COMMENTS_DOMAIN;

const getCurrentTime = () => new Date().getTime();
const minimumSubmissionTime = 1000;

export default ({ newComment }) => {
  const isMounted = useIsMounted();
  const formRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrorMessage, setFormError] = useState("");
  const [shouldShowFullForm, setShouldShowFullForm] = useState(false);

  const submitComment = async e => {
    const startTime = getCurrentTime();

    e.preventDefault();
    setFormError("");
    setIsSubmitting(true);

    let mutationParams = formInputsToValues(formRef.current);

    formRef.current.reset();

    const query = `
      mutation CreateComment(
        $name: String!,
        $path: String!,
        $content: String!,
        $domain: String!,
        $emailAddress: String
      ){
        createComment(
          name: $name,
          path: $path,
          content: $content,
          emailAddress: $emailAddress
          domain: $domain
        ) {
          createdAt
          name
          emailAddress
          content
          id
          site {
            domain
          }
        }
      }
    `;

    const { name, content, emailAddress } = mutationParams;

    const variables = {
      name,
      domain,
      content,
      emailAddress,
      path: window.location.pathname
    };

    let response;

    try {
      response = await client.send(query, variables);

      if (response?.errors?.length) {
        console.log(response.errors[0].message);
        setFormError("Sorry, something went wrong!");
        return;
      }
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
                tabIndex="-1"
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
