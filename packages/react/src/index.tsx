import * as React from "react";
import CommentBox from "./components/CommentBox";
import CommentList from "./components/CommentList";
import "@jam-comments/styles";

const { useState } = React;

type JamCommentsProps = {
  initialComments?: any[];
};

const JamComments = ({ initialComments = [] }: JamCommentsProps) => {
  let [comments, setComments] = useState(initialComments);

  const newComment = (newComment: any) => {
    setComments([newComment, ...comments]);
  };

  return (
    <div className={"jc-Shell"}>
      <CommentBox newComment={newComment} />
      <CommentList comments={comments} />
    </div>
  );
};

export default JamComments;
