import { Product } from './product.js';
import { Query as ProductQuery } from './product.js';
import { Mutation as ProductMutation } from './product.js';
import { Subscription as ProductSubscription } from './product.js';

import { Category } from './category.js';
import { Query as CategoryQuery } from './category.js';
import { Mutation as CategoryMutation } from './category.js';

import { Query as ImageQuery } from './image.js';
import { Mutation as ImageMutation } from './image.js';

import { ImageCollection } from './image-collection.js';
import { Query as ImageCollectionQuery } from './image-collection.js';
import { Mutation as ImageCollectionMutation } from './image-collection.js';

import { ProductCollection } from './product-collection.js';
import { Query as ProductCollectionQuery } from './product-collection.js';
import { Mutation as ProductCollectionMutation } from './product-collection.js';

import { default as GraphQLUpload } from 'graphql-upload/GraphQLUpload.mjs';

export const resolvers = {
  Upload: GraphQLUpload,
  Query: {
    ...ProductQuery,
    ...CategoryQuery,
    ...ImageQuery,
    ...ImageCollectionQuery,
    ...ProductCollectionQuery,
  },
  Mutation: {
    ...ProductMutation,
    ...CategoryMutation,
    ...ImageMutation,
    ...ImageCollectionMutation,
    ...ProductCollectionMutation,
  },
  Subscription: {
    ...ProductSubscription,
  },
  Product,
  Category,
  ImageCollection,
  ProductCollection,
};
