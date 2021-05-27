import * as React from "react";
import ApiContext from "./apiContext";
import CommentBox from "./components/CommentBox";
import CommentList from "./components/CommentList";
import sortComments from "@jam-comments/utilities/shared/sortComments";
import countComments from "@jam-comments/utilities/shared/countComments";
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
  initialComments = [],
  platform = "",
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

    setComments(sortComments([newComment, ...comments]));
  };

  return (
    <ApiContext.Provider
      value={{ domain, apiKey, platform, newComment } as CommentBoxProps}
    >
      <div className="jc-Shell">
        <div className="jc-Shell-container">
          <CommentBox
            newComment={newComment}
            domain={domain}
            apiKey={apiKey}
            platform={platform}
          />
          <CommentList comments={comments} />
        </div>
      </div>
    </ApiContext.Provider>
  );
};

export default JamComments;
