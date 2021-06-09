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
  isPending?: boolean
  children?: Comment[]
}
interface CommentBoxProps {
  domain: string;
  apiKey: string;
  platform: string;
  newComment: Function;
  parent?: number
}

interface JamCommentsProps extends CommentBoxProps {
  initialComments?: Comment[];
}


