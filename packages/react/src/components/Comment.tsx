import React, { useMemo } from "react";
import { toPrettyDate, toIsoString } from "../utils/formatDate";

type CommentProps = {
  comment: Comment;
};

export default ({ comment }: CommentProps) => {
  const formattedContent = useMemo(
    () => comment.content.replace(/\n/g, "<br/><br/>"),
    []
  );
  const { isPending } = comment;

  return (
    <div className={"jc-Comment"}>
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
      <div className={"jc-Comment-content"}>
        <p dangerouslySetInnerHTML={{ __html: formattedContent }} />
      </div>
    </div>
  );
};
