export interface Comment {
  content: string;
  created_at: string;
  id: number;
  name: string;
  email: string;
  site: number;
  path: string;
  status: string;
  parent_comment_id?: number;
}

interface ICommentRequest {
  endpoint: string;
  apiKey: string;
  platform: string;
  path: string;
  domain: string;
}

interface ICommentData
  extends Omit<Comment, "created_at" | "id" | "site" | "status"> {
  domain: string;
  time_to_comment: number;
}

const CommentRequest = ({
  endpoint,
  apiKey,
  platform,
  path,
  domain,
}: ICommentRequest) => {
  return {
    post: async (commentData: ICommentData) => {
      commentData.path = path;
      commentData.domain = domain;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
          "X-Platform": platform,
        },
        body: JSON.stringify(commentData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      return data as {
        data: Comment;
      };
    },
  };
};

export default CommentRequest;
