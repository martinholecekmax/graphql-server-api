import gql from 'graphql-tag';

export const typeDefs = gql`
  #graphql
  type ImageCollection {
    id: ID
    images: [Image]
    createdAt: Date
    updatedAt: Date
  }

  input ImageCollectionInput {
    id: ID
    images: [ID]
  }
`;
