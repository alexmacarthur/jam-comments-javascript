export const CREATE_COMMENT_QUERY = `
  mutation CreateComment(
    $name: String!,
    $path: String!,
    $content: String!,
    $domain: String!,
    $emailAddress: String
  ){
    createComment(
      name: $name,
      path: $path,
      content: $content,
      emailAddress: $emailAddress
      domain: $domain
    ) {
      createdAt
      name
      emailAddress
      content
      id
      site {
        domain
      }
    }
  }
`;
