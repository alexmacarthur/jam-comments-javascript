import React from "react";

type MessageProps = {
  isSuccessful?: boolean,
  children: any
}

export default ({ children, isSuccessful = false } : MessageProps) => {
  const cssClass = isSuccessful ? "jc-Message--success" : "jc-Message--error";
  return (
    <div className={`jc-Message ${cssClass}`}>
      <p>{children}</p>
    </div>
  );
};
