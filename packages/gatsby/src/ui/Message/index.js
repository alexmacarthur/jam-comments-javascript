import React from "react";
import "./style.scss";

export default ({ children, isSuccessful = false }) => {
  const cssClass = isSuccessful ? "jc-Message--success" : "jc-Message--error";
  return (
    <div className={`jc-Message ${cssClass}`}>
      <p>{children}</p>
    </div>
  );
};
