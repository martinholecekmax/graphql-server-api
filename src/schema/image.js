export const typeDefs = `#graphql
    type Image {
        id: ID
        fileName: String
        url: String
        alt: String
        imageType: String
        createdAt: Date
        rootDirectory: String
    }
`;
