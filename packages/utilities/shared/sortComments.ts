const sortComments = (comments): any[] => {
  const sortedComments = [...comments];

  for (const comment of comments) {
    const parentIndex = comments.findIndex((c) => c.id === comment.parent?.id);

    // This is a top-level comment.
    if (parentIndex < 0) continue;

    sortedComments[parentIndex].children =
      sortedComments[parentIndex].children || [];
    sortedComments[parentIndex].children.push(comment);

    sortedComments[parentIndex].children = sortedComments[
      parentIndex
    ].children.sort((a, b) => {
      if (Number(a.id) < Number(b.id)) return 1;

      return -1;
    });
  }

  // Only permit top-level, parentless comments in the final thing.
  return sortedComments.filter((c) => !c.parent);
};

export default sortComments;
