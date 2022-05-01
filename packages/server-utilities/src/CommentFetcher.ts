import {
  getServiceEndpoint,
  isDev as isDevCheck,
} from "@jam-comments/shared-utilities";
import log from "./log";
import { QuestClient } from "graphql-quest";
import dummyComments from "./dummy-comments.json";
import { makeHtmlReady } from "./utils";

const PER_PAGE = 50;
const COMMENTS_QUERY = `
  fragment commentFields on Comment {
    createdAt
    name
    content
    path
    id
  }

  query Comments($domain: String!, $status: String, $skip: Int, $perPage: Int, $path: String){
    comments(domain: $domain, status: $status, skip: $skip, perPage: $perPage, path: $path) {
      items {
        ...commentFields
        children {
          ...commentFields
        }
      }
      meta {
        hasMore
      }
    }
  }`;

class CommentFetcher {
  isDev;
  domain;
  client;
  
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
  async _getBatchOfComments({ skip = 0, path = "" }): Promise<{
    comments: any[],
    hasMore: boolean,
  }> {
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
      // @ts-ignore
      delete comment.emailAddress;

      return comment;
    });
  }

  _prepareContent(comments: any[]) {
    return comments.map(c => {
      c.content = makeHtmlReady(c.content);

      return c;
    });
  }

  /**
   * Get all the comments until there are no more remaining.
   *
   * @returns Promise<array>
   */
  async getAllComments(path = "") {
    if (this.isDev) {
      return this._prepareContent(this._prepareDummyComments());
    }

    let allComments: any[] = [];
    let skip = 0;
    let hasMore = false;

    do {
      const freshFetch = await this._getBatchOfComments({ skip, path });
      hasMore = freshFetch.hasMore;
      skip = skip + freshFetch.comments.length;
      allComments = [...allComments, ...freshFetch.comments];
    } while (hasMore);

    return this._prepareContent(allComments);
  }
}

export default CommentFetcher;
