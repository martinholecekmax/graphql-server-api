import gql from 'graphql-tag';

export const typeDefs = gql`
  #graphql
  type Category {
    id: ID
    title: String
    path: String
    description: String
    productCollection: ProductCollection
    createdAt: Date
    updatedAt: Date
  }

  input CategoryInput {
    id: ID
    title: String
    path: String
    description: String
  }

  enum CategorySortableFields {
    title
    createdAt
    updatedAt
  }

  input CategorySortInput {
    field: CategorySortableFields!
    order: SortOrder!
  }

  input CategoryConnectionInput {
    skip: Int
    limit: Int
    sort: CategorySortInput
  }

  type CategoryConnection {
    nodes: [Category]
    pageInfo: PageInfo!
  }
`;
