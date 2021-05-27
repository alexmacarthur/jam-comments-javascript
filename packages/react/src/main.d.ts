declare module "*.svg" {
  const content: any;
  export default content;
}

interface Comment {
  content: string;
  createdAt: string;
  emailAddress: string;
  id: string;
  name: string;
  site: any;
  isPending?: boolean;
  children?: Comment[];
}
interface CommentBoxProps {
  domain: string;
  apiKey: string;
  platform: string;
  newComment: Function;
  parent?: number;
  forceFormOpen?: boolean;
  onSubmission?: (newComment: Comment) => any;
}

interface JamCommentsProps extends CommentBoxProps {
  initialComments?: Comment[];
}
