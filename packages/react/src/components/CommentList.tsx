import React from "react";
import Comment from "./Comment";

const pluralize = (items: Comment[], word: string): string => {
  const onlyOne = items.length === 1;

  if (word === "reply") {
    return onlyOne ? word : `replies`;
  }

  return onlyOne ? word : `${word}s`;
};

interface CommentListProps {
  comments: Comment[];
  isReplies: boolean;
}

export default ({ comments, isReplies = false }: CommentListProps) => {
  return (
    <div
      className={`jc-CommentList ${isReplies ? "jc-CommentList--replies" : ""}`}
    >
      <span className={"jc-CommentList-count"}>
        {comments.length} {pluralize(comments, isReplies ? "reply" : "comment")}
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
