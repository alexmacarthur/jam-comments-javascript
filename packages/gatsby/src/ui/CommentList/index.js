import React from "react";
import Comment from "../Comment";
import "./styles.scss";

const pluralize = (items, word) => {
  return items.length === 1 ? word : `${word}s`;
};

export default ({ comments }) => {
  return (
    <div className={"jc-CommentList"}>
      <span className={"jc-CommentList-count"}>
        {comments.length} {pluralize(comments, "comment")}
      </span>

      <ul className={"jc-CommentList-list"}>
        {comments.map(comment => {
          return (
            <li key={comment.id} className={"jc-CommentList-item"}>
              <Comment comment={comment} />
            </li>
          );
        })}
      </ul>
    </div>
  );
};
