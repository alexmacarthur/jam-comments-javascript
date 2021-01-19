import { QuestClient } from "graphql-quest";
import getServiceEndpoint from "@jam-comments/utilities/shared/getServiceEndpoint";

const getClient = (apiKey: string) => {
  return QuestClient({
    endpoint: `${getServiceEndpoint(
      process.env.JAM_COMMENTS_SERVICE_ENDPOINT
    )}/graphql`,
    headers: {
      "x-api-key": apiKey,
    },
  });
};

export default getClient;
