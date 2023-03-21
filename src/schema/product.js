import gql from 'graphql-tag';

export const typeDefs = gql`
  #graphql
  type Product {
    id: ID
    title: String
    path: String
    description: String
    price: Float
    imageCollection: ImageCollection
    createdAt: Date
    updatedAt: Date
  }

  input ProductInput {
    id: ID
    title: String
    path: String
    description: String
    price: Float
    imageCollection: ID
  }

  enum ProductSortableFields {
    title
    price
    path
    createdAt
    updatedAt
  }

  input ProductSortInput {
    field: ProductSortableFields!
    order: SortOrder!
  }

  input ProductConnectionInput {
    skip: Int
    limit: Int
    sort: ProductSortInput
  }

  type ProductConnection {
    nodes: [Product]
    pageInfo: PageInfo!
  }
`;
