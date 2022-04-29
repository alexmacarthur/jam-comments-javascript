import CommentFetcher from "./CommentFetcher";

describe("_prepareDummyComments()", () => {
  it("orders comments correctly.", () => {
    const fetcher = new CommentFetcher({
      domain: "test.com",
      apiKey: "abc123",
    });

    const [
      commentOne,
      commentTwo,
      commentThree,
    ] = fetcher._prepareDummyComments().map((c) => {
      c.createdAt = Number(c.createdAt);

      return c;
    });

    expect(commentOne.createdAt).toBeGreaterThan(commentTwo.createdAt);
    expect(commentTwo.createdAt).toBeGreaterThan(commentThree.createdAt);
  });
});

describe("getAllCommentPaths()", () => {
  describe("prod mode", () => {
    it("fetches comments from service", async () => {
      const fetcher = new CommentFetcher({
        domain: "test.com",
        apiKey: "abc123",
        isDev: false,
      });

      const prepareDummyCommentsSpy = jest.spyOn(
        fetcher,
        "_prepareDummyComments"
      );
      const getBatchOfCommentsSpy = jest
        .spyOn(fetcher, "_getBatchOfComments")
        .mockImplementation(() => {
          return {
            hasMore: false,
            comments: [],
          };
        });

      await fetcher.getAllComments();

      expect(getBatchOfCommentsSpy).toHaveBeenCalledTimes(1);
      expect(prepareDummyCommentsSpy).not.toHaveBeenCalled();
    });
  });

  describe("dev mode", () => {
    it("returns dummy comments", async () => {
      const fetcher = new CommentFetcher({
        domain: "test.com",
        apiKey: "abc123",
        isDev: true,
      });

      const prepareDummyCommentsSpy = jest.spyOn(
        fetcher,
        "_prepareDummyComments"
      );
      const getBatchOfCommentsSpy = jest.spyOn(fetcher, "_getBatchOfComments");

      await fetcher.getAllComments();

      expect(prepareDummyCommentsSpy).toHaveBeenCalledTimes(1);
      expect(getBatchOfCommentsSpy).not.toHaveBeenCalled();
    });
  });
});
