import * as React from "react";
import CommentBox from "./components/CommentBox";
import CommentList from "./components/CommentList";
import "@jam-comments/styles";

const { useState } = React;

const JamComments = ({
  initialComments = [],
  domain,
  apiKey,
}: JamCommentsProps) => {
  let [comments, setComments] = useState(initialComments);

  const newComment = (newComment: Comment) => {
    newComment.isPending = true;

    setComments([newComment, ...comments]);
  };

  return (
    <div className={"jc-Shell"}>
      <CommentBox newComment={newComment} domain={domain} apiKey={apiKey} />
      <CommentList comments={comments} />
    </div>
  );
};

export default JamComments;
