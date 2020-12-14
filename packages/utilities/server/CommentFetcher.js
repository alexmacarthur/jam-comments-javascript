require("isomorphic-fetch");
const { getServiceEndpoint, log } = require("../shared");
const { QuestClient } = require("graphql-quest");

const PER_PAGE = 50;
const COMMENTS_QUERY = `
  query Comments($domain: String!, $status: String, $skip: Int, $perPage: Int){
    comments(domain: $domain, status: $status, skip: $skip, perPage: $perPage) {
      items {
        createdAt
        name
        emailAddress
        content
        path
        id
      }
      meta {
        hasMore
      }
    }
  }`;

class CommentFetcher {
  constructor({ domain, apiKey }) {
    this.domain = domain;

    this.client = QuestClient({
      endpoint: `${getServiceEndpoint()}/graphql`,
      method: "GET",
      headers: {
        "x-api-key": apiKey,
      },
    });
  }

  /**
   * Retrieve a batch of comments.
   *
   * @param {number} skip
   * @returns {object}
   */
  async getBatchOfComments(skip = 0) {
    const { data, errors } = await this.client.send(COMMENTS_QUERY, {
      domain: this.domain,
      status: "approved",
      perPage: PER_PAGE,
      skip,
    });
    const { items, meta } = data.comments;

    if (errors && errors.length) {
      throw new Error(errors[0].message);
    }

    log(`Fetched a batch of ${items.length} comments.`);

    return {
      comments: items,
      hasMore: meta.hasMore,
    };
  }

  /**
   * Get all the comments until there are no more remaining.
   *
   * @returns Promise<array>
   */
  async getAllComments() {
    let allComments = [];
    let skip = 0;
    let hasMore = false;

    do {
      const freshFetch = await this.getBatchOfComments(skip);
      hasMore = freshFetch.hasMore;
      skip = skip + freshFetch.comments.length;
      allComments = [...allComments, ...freshFetch.comments];
    } while (hasMore);

    return allComments;
  }
}

module.exports = CommentFetcher;
