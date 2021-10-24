export const CREATE_COMMENT_QUERY = `
  mutation CreateComment(
    $name: String!,
    $path: String!,
    $content: String!,
    $domain: String!,
    $parent: ID,
    $emailAddress: String
  ){
    createComment(
      name: $name,
      path: $path,
      content: $content,
      domain: $domain,
      parent: $parent,
      emailAddress: $emailAddress
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
