export const CREATE_COMMENT = `
  mutation CreateComment(
    $name: String!
    $path: String!
    $content: String!
    $domain: String!
    $emailAddress: String
    $parent: ID
  ){
    createComment(
      name: $name
      path: $path
      content: $content
      emailAddress: $emailAddress
      domain: $domain
      parent: $parent
    ) {
      parent {
        id
        name
        path
        content
      }
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
