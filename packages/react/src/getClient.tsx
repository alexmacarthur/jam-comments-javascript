import { QuestClient } from "graphql-quest";
import getServiceEndpoint from "@jam-comments/utilities/shared/getServiceEndpoint";

const getClient = (apiKey: string, platform: string) => {
  return QuestClient({
    endpoint: `${getServiceEndpoint(
      process.env.JAM_COMMENTS_SERVICE_ENDPOINT
    )}/graphql`,
    headers: {
      "x-api-key": apiKey,
      "x-platform": platform,
    },
  });
};

export default getClient;
