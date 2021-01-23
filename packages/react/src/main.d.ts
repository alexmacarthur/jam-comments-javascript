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
}

interface JamCommentsProps {
  initialComments?: Comment[];
  domain: string;
  apiKey: string;
}
