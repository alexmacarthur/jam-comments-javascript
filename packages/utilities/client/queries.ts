export const CREATE_COMMENT_QUERY = `
  mutation CreateComment(
    $name: String!,
    $path: String!,
    $content: String!,
    $domain: String!,
    $duration: Int!,
    $parent: ID,
    $emailAddress: String,
    $password: String
  ){
    createComment(
      name: $name,
      path: $path,
      content: $content,
      duration: $duration,
      domain: $domain,
      parent: $parent,
      emailAddress: $emailAddress,
      password: $password
    ) {
      createdAt
      name
      emailAddress
      content
      id
      parent {
        id
      }
      site {
        domain
      }
    }
  }
`;
