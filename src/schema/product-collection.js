import gql from 'graphql-tag';

export const typeDefs = gql`
  #graphql
  type ProductCollection {
    id: ID
    products(input: ProductConnectionInput): ProductConnection
  }

  input ProductCollectionInput {
    id: ID
    products: [ID]
  }
`;
