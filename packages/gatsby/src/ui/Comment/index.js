import React, { useMemo } from "react";
import { toPrettyDate, toIsoString } from "../../utils/formatDate";
import "./styles.scss";

export default ({ comment }) => {
  comment.content = useMemo(() => comment.content.replace(/\n/g, "<br>\n"), []);

  return (
    <div className={"jc-Comment"}>
      <span className={"jc-Comment-details"}>
        <h6 className={"jc-Comment-name"}>{comment.name}</h6>

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
      </span>
      <div className={"jc-Comment-content"}>
        <p dangerouslySetInnerHTML={{ __html: comment.content }} />
      </div>
    </div>
  );
};
