import gql from 'graphql-tag';

export const typeDefs = gql`
  #graphql
  type PageInfo {
    currentPage: Int
    hasNextPage: Boolean
    hasPreviousPage: Boolean
    itemCount: Int
    pageCount: Int
    perPage: Int
    totalCount: Int
  }
`;
