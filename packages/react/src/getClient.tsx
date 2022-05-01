import { QuestClient } from "graphql-quest";
import { getServiceEndpoint } from "@jam-comments/shared-utilities";

const getClient = (apiKey: string, platform: string) => {
  return QuestClient({
    endpoint: `${getServiceEndpoint()}/graphql`,
    headers: {
      "x-api-key": apiKey,
      "x-platform": platform,
    },
  });
};

export default getClient;
