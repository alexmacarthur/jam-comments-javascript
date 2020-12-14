import { QuestClient } from "graphql-quest";
import getServiceEndpoint from "jam-comments-utilities/shared/getServiceEndpoint";

const client = QuestClient({
  endpoint: `${getServiceEndpoint(
    process.env.JAM_COMMENTS_SERVICE_ENDPOINT
  )}/graphql`,
  headers: {
    "x-api-key": process.env.GATSBY_JAM_COMMENTS_API_KEY
  }
});

export default client;
