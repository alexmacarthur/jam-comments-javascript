import React, { useState } from "react";
import CommentBox from "../CommentBox";
import CommentList from "../CommentList";
import "./styles.scss";

export default ({ pageContext }) => {
  const initialComments =
    pageContext && pageContext.comments ? pageContext.comments : [];

  let [comments, setComments] = useState(initialComments);

  const newComment = newComment => {
    setComments([newComment, ...comments]);
  };

  return (
    <div className={"jc-Shell"}>
      <CommentBox newComment={newComment} />
      <CommentList comments={comments}></CommentList>
    </div>
  );
};
