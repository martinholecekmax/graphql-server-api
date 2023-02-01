export const typeDefs = `#graphql
    type Product {
        id: ID
        title: String
        description: String
        price: Float
        images: [Image]
    }
`;
