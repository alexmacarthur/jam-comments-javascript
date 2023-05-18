import Alpine from "alpinejs";
import jcAuth from "./components/jcAuth";
import jcComment from "./components/jcComment";
import jcCommentBox from "./components/jcCommentBox";

if (window) {
  window.jcAlpine = Alpine;
}

export const initialize = () => {
  Alpine.prefix("jc-");
  Alpine.data("jcAuth", jcAuth);
  Alpine.data("jcComment", jcComment);
  Alpine.data("jcCommentBox", jcCommentBox);

  if (window.jcAlpine) {
    jcAlpine.start();
  }
};
