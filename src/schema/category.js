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

  input FilterCategory {
    and: [FilterCategory!]
    or: [FilterCategory!]
    title: FilterString
    path: FilterString
    description: FilterString
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
    filter: FilterCategory
    skip: Int
    limit: Int
    sort: CategorySortInput
  }

  type CategoryConnection {
    nodes: [Category]
    pageInfo: PageInfo!
  }
`;
