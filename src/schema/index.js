import gql from 'graphql-tag';

import { typeDefs as Product } from './product.js';
import { typeDefs as Category } from './category.js';
import { typeDefs as Image } from './image.js';
import { typeDefs as ImageCollection } from './image-collection.js';
import { typeDefs as PageInfo } from './page-info.js';
import { typeDefs as ProductCollection } from './product-collection.js';

const Query = gql`
  #graphql
  scalar Upload
  scalar Date

  enum SortOrder {
    ASC
    DESC
  }

  input FilterFloat {
    exists: Boolean
    eq: Float
    ne: Float
    gt: Float
    gte: Float
    lt: Float
    lte: Float
  }

  input FilterString {
    exists: Boolean
    eq: String
    ne: String
    contains: String
    caseSensitive: Boolean
  }

  type Query {
    allProducts(input: ProductConnectionInput): ProductConnection
    product(id: ID!): Product

    allCategories(input: CategoryConnectionInput): CategoryConnection
    category(id: ID!): Category

    allImages: [Image]

    allImageCollections: [ImageCollection]
    imageCollection(id: ID!): ImageCollection

    productCollection(id: ID!): ProductCollection
  }

  type Mutation {
    createProduct(input: ProductInput): Product
    updateProduct(input: ProductInput): Product
    removeProduct(id: ID!): Product

    createCategory(input: CategoryInput): Category
    updateCategory(input: CategoryInput): Category
    removeCategory(id: ID!): Category

    uploadImage(file: Upload!, alt: String): Image
    updateImage(id: ID!, file: Upload, alt: String): Image
    removeImage(id: ID!): Image

    createImageCollection(input: ImageCollectionInput): ImageCollection
    updateImageCollection(input: ImageCollectionInput): ImageCollection
    removeImageCollection(id: ID!): ImageCollection

    uploadImageToImageCollection(id: ID!, image: ImageInput): ImageCollection
    updateImageInCollection(id: ID!, image: ImageInput): ImageCollection
    removeImageFromImageCollection(id: ID!, imageId: ID!): ImageCollection

    createProductCollection(input: ProductCollectionInput): ProductCollection
    removeProductCollection(id: ID!): ProductCollection
    addProductToCollection(id: ID!, product: ID!): ProductCollection
    removeProductFromCollection(id: ID!, product: ID!): ProductCollection
  }

  type Subscription {
    productAdded: Product
    productUpdated: Product
    productRemoved: Product
  }
`;

const typeDefs = [
  Query,
  Product,
  ProductCollection,
  Category,
  Image,
  ImageCollection,
  PageInfo,
];

export default typeDefs;
