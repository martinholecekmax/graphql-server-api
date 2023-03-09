import { Product } from './product.js';
import { Query as ProductQuery } from './product.js';
import { Mutation as ProductMutation } from './product.js';
import { Subscription as ProductSubscription } from './product.js';

import { Category } from './category.js';
import { Query as CategoryQuery } from './category.js';
import { Mutation as CategoryMutation } from './category.js';

import { Query as ImageQuery } from './image.js';
import { Mutation as ImageMutation } from './image.js';

import { ImageCollection } from './imageCollection.js';
import { Query as ImageCollectionQuery } from './imageCollection.js';
import { Mutation as ImageCollectionMutation } from './imageCollection.js';

import { default as GraphQLUpload } from 'graphql-upload/GraphQLUpload.mjs';

export const resolvers = {
  Upload: GraphQLUpload,
  Query: {
    ...ProductQuery,
    ...CategoryQuery,
    ...ImageQuery,
    ...ImageCollectionQuery,
  },
  Mutation: {
    ...ProductMutation,
    ...CategoryMutation,
    ...ImageMutation,
    ...ImageCollectionMutation,
  },
  Subscription: {
    ...ProductSubscription,
  },
  Product,
  Category,
  ImageCollection,
};
