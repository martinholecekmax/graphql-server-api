import { typeDefs as Product } from './product.js';
import { typeDefs as Category } from './category.js';
import { typeDefs as Image } from './image.js';

const Query = `#graphql
  scalar Upload
  scalar Date

  type Query {
    allProducts: [Product]
    product(id: ID!): Product

    allCategories: [Category]
    category(id: ID!): Category

    allImages: [Image]
  }

  type Mutation {
    createProduct(input: ProductInput): Product
    updateProduct(input: ProductInput): Product
    removeProduct(id: ID!): Product

    createCategory(input: CategoryInput): Category
    updateCategory(input: CategoryInput): Category
    removeCategory(id: ID!): Category

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
