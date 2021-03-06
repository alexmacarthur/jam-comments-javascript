const { getServiceEndpoint, log } = require("../shared");
const { QuestClient } = require("graphql-quest");
const isDevCheck = require("../shared/isDev");
const dummyComments = require("./dummy-comments.json");

const PER_PAGE = 50;
const COMMENTS_QUERY = `
  query Comments($domain: String!, $status: String, $skip: Int, $perPage: Int, $path: String){
    comments(domain: $domain, status: $status, skip: $skip, perPage: $perPage, path: $path) {
      items {
        createdAt
        name
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
  constructor({ domain, apiKey, isDev = isDevCheck() }) {
    this.isDev = isDev;
    this.domain = domain;
    this.client = QuestClient({
      endpoint: `${getServiceEndpoint()}/graphql`,
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
  async _getBatchOfComments({ skip = 0, path = "" }) {
    const { data, errors } = await this.client.send(COMMENTS_QUERY, {
      domain: this.domain,
      status: "approved",
      perPage: PER_PAGE,
      path,
      skip,
    });

    if (!data && errors && errors.length) {
      throw new Error(
        `Something went wrong with JamComments! Here's the error:

${JSON.stringify(errors)}`
      );
    }

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

  _prepareDummyComments() {
    const descendingDates = dummyComments
      .map((d) => d.createdAt)
      .sort()
      .reverse();

    return dummyComments.map((comment, index) => {
      comment.createdAt = descendingDates[index];

      // Mimic how the data will be retrieved in production.
      delete comment.emailAddress;

      return comment;
    });
  }

  /**
   * Get all the comments until there are no more remaining.
   *
   * @returns Promise<array>
   */
  async getAllComments(path = "") {
    if (this.isDev) {
      return this._prepareDummyComments();
    }

    let allComments = [];
    let skip = 0;
    let hasMore = false;

    do {
      const freshFetch = await this._getBatchOfComments({ skip, path });
      hasMore = freshFetch.hasMore;
      skip = skip + freshFetch.comments.length;
      allComments = [...allComments, ...freshFetch.comments];
    } while (hasMore);

    return allComments;
  }
}

module.exports = CommentFetcher;
