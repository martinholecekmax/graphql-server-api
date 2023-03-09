export const typeDefs = `#graphql
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
