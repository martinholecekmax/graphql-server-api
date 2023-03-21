import gql from 'graphql-tag';

export const typeDefs = gql`
  #graphql
  type Image {
    id: ID
    fileName: String
    url: String
    alt: String
    imageType: String
    createdAt: Date
    rootDirectory: String
  }

  input ImageInput {
    id: ID
    file: Upload
    fileName: String
    url: String
    alt: String
    imageType: String
    rootDirectory: String
  }
`;
