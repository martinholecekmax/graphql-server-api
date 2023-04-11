import gql from 'graphql-tag';

export const typeDefs = gql`
  #graphql

  enum Status {
    DRAFT
    PUBLISHED
  }

  type Product {
    id: ID
    title: String
    path: String
    description: String
    price: Float
    imageCollection: ImageCollection
    status: Status
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
    status: Status
  }

  input FilterStatus {
    eq: Status
    ne: Status
  }

  input FilterProduct {
    and: [FilterProduct!]
    or: [FilterProduct!]
    title: FilterString
    path: FilterString
    description: FilterString
    price: FilterFloat
    status: FilterStatus
  }

  enum ProductSortableFields {
    title
    price
    path
    status
    createdAt
    updatedAt
  }

  input ProductSortInput {
    field: ProductSortableFields!
    order: SortOrder!
  }

  input ProductConnectionInput {
    filter: FilterProduct
    skip: Int
    limit: Int
    sort: ProductSortInput
  }

  type ProductConnection {
    nodes: [Product]
    pageInfo: PageInfo!
  }
`;
