const getChildren = (comment): any[] => {
  if (!comment.children) return [];

  return comment.children.reduce((nestedChildren, child) => {
    if (child.children) {
      return [...nestedChildren, ...getChildren(child)];
    }

    return nestedChildren;
  }, comment.children);
};

const countComments = (comments: any[]): any[] => {
  return comments.reduce((allComments, comment) => {
    return [...allComments, ...getChildren(comment)];
  }, comments).length;
};

export default countComments;
