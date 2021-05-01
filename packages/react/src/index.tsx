import * as React from "react";
import CommentBox from "./components/CommentBox";
import CommentList from "./components/CommentList";
import "@jam-comments/styles";

const { useState } = React;

const validateApiKeyAndDomain = (values) => {
  Object.entries(values).forEach(([key, value]) => {
    if (value) return;

    console.error(
      `Your ${key} is missing! Please verify that it's being passed correctly.`
    );
  });
};

const JamComments = ({
  platform = "",
  initialComments = [],
  domain,
  apiKey,
}: JamCommentsProps) => {
  validateApiKeyAndDomain({
    JAM_COMMENTS_DOMAIN: domain,
    JAM_COMMENTS_API_KEY: apiKey,
  });

  const [comments, setComments] = useState(initialComments);

  const newComment = (newComment: Comment) => {
    newComment.isPending = true;

    setComments([newComment, ...comments]);
  };

  return (
    <div className={"jc-Shell"}>
      <CommentBox
        newComment={newComment}
        domain={domain}
        apiKey={apiKey}
        platform={platform}
      />
      <CommentList comments={comments} />
    </div>
  );
};

export default JamComments;
