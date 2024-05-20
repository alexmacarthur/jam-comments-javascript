import { getTokenFromCookie } from "./utils";

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
  should_stub?: boolean;
}

interface ICommentData
  extends Omit<
    Comment,
    "created_at" | "id" | "site" | "status" | "path" | "domain"
  > {
  domain?: string;
  path?: string;
  time_to_comment: number;
  should_stub?: boolean;
}

const CommentRequest = (
  {
    endpoint,
    apiKey,
    platform,
    path,
    domain,
    should_stub = false,
  }: ICommentRequest,
  fetchImplementation = fetch,
) => {
  return {
    post: async (commentData: ICommentData) => {
      commentData.path = path;
      commentData.domain = domain;
      commentData.should_stub = should_stub;

      const response = await fetchImplementation(endpoint, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`, // For the site owner.
          "X-Platform": platform,
          "X-Jc-Token": getTokenFromCookie(), // For the author.
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
