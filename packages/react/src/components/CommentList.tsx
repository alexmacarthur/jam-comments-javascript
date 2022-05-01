import React from "react";
import Comment from "./Comment";
import { countComments } from "@jam-comments/shared-utilities";

const pluralize = (commentCount: number, word: `reply` | `comment`) => {
  const onlyOne = commentCount === 1;

  if (word === "reply") {
    return onlyOne ? word : `replies`;
  }

  return onlyOne ? word : `${word}s`;
};

interface CommentListProps {
  comments: Comment[];
  isReplies?: boolean;
}

export default ({ comments, isReplies = false }: CommentListProps) => {
  const commentCount: number = countComments(comments);

  return (
    <div
      className={`jc-CommentList ${isReplies ? "jc-CommentList--replies" : ""}`}
    >
      <span className={"jc-CommentList-count"}>
        {commentCount}{" "}
        {pluralize(commentCount, isReplies ? "reply" : "comment")}
      </span>

      <ul className={"jc-CommentList-list"}>
        {comments.map((comment) => {
          return (
            <li key={comment.id} className={"jc-CommentList-item"}>
              <Comment comment={comment} isReply={isReplies} />
            </li>
          );
        })}
      </ul>
    </div>
  );
};
