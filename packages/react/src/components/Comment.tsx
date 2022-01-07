import React, { useMemo, useState, useContext } from "react";
import { toPrettyDate, toIsoString } from "../utils/formatDate";
import CommentBox from "./CommentBox";
import ApiContext from "../apiContext";
import CommentList from "./CommentList";

type CommentProps = {
  comment: Comment;
  isReply: boolean;
};

const Comment = ({ comment, isReply = false }: CommentProps) => {
  const apiContext = useContext(ApiContext) as CommentBoxProps;
  const { isPending, children } = comment;
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState("Reply");

  const toggleReply = () => {
    setReplyText(showReplyForm ? "Reply" : "Cancel Reply");
    setShowReplyForm(!showReplyForm);
  };

  return (
    <div className={"jc-Comment"} data-comment-id={comment.id}>
      <span className={"jc-Comment-details"}>
        <h6 className={"jc-Comment-name"}>{comment.name}</h6>

        <span className="jc-Comment-meta">
          <a
            className={"jc-Comment-anchor"}
            href={`#comment-${comment.id}`}
            aria-label="comment anchor link"
          >
            <time
              className={"jc-Comment-date"}
              dateTime={toIsoString(comment.createdAt)}
            >
              {toPrettyDate(comment.createdAt)}
            </time>
          </a>

          {isPending ? (
            <small className={"jc-Comment-statusMessage"}>(is pending)</small>
          ) : null}
        </span>
      </span>
      <div
        className={"jc-Comment-content"}
        dangerouslySetInnerHTML={{ __html: comment.content }}
      ></div>

      <div className={"jc-Comment-actions"}>
        <ul className={"jc-Comment-actionList"}>
          {!isReply && (
            <li>
              <button
                className={"jc-Comment-actionButton"}
                onClick={toggleReply}
              >
                {replyText}
              </button>
            </li>
          )}
        </ul>
      </div>

      {showReplyForm ? (
        <div className={"jc-Comment-replyForm"}>
          <CommentBox
            {...apiContext}
            parent={Number(comment.id)}
            forceFormOpen={true}
            onSubmission={(newComment: Comment) => {
              setShowReplyForm(!newComment);
            }}
          />
        </div>
      ) : null}

      {children && <CommentList comments={children} isReplies={true} />}
    </div>
  );
};

export default Comment;
