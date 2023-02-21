export const typeDefs = `#graphql
    type Product {
        id: ID
        title: String
        path: String
        description: String
        price: Float
        images: [Image]
        createdAt: Date
        updatedAt: Date
    }

    input ProductInput {
        id: ID
        title: String
        path: String
        description: String
        price: Float
        images: [ID]
    }
`;
