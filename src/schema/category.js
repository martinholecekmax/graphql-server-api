export const typeDefs = `#graphql
    type Category {
        id: ID
        title: String
        path: String
        description: String
        products: [Product]
        createdAt: Date
        updatedAt: Date
    }

    input CategoryInput {
        id: ID
        title: String
        path: String
        description: String
        products: [String]
    }
`;
