export const typeDefs = `#graphql
    type Category {
        id: ID
        title: String
        description: String
        products: [Product]
        createdAt: Date
        updatedAt: Date
    }
`;
