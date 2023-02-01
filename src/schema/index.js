import { typeDefs as Product } from './product.js';
import { typeDefs as Category } from './category.js';
import { typeDefs as Image } from './image.js';

const Query = `#graphql
  scalar Upload

  type Query {
    allProducts: [Product]
    allCategories: [Category]
    allImages: [Image]
  }

  type Mutation {
    createProduct(title: String!, description: String!, price: Float!): Product
    updateProduct(id: ID!,title: String, description: String, price: Float, images: [ID]): Product

    createCategory(title: String!, description: String! products: [ID]!): Category
    updateCategory(id: ID!, title: String, description: String, products: [ID]): Category

    uploadImage(file: Upload! alt: String): Image
    removeImage(id: ID!): Image
  }

  type Subscription {
    productAdded: Product
    productUpdated: Product
  }
`;

const typeDefs = [Query, Product, Category, Image];

export default typeDefs;
