import { authenticate } from '../middlewares/auth.js';
import { connectionHelper } from '../utils/connection.js';

export const Query = {
  product: async (_parent, args, { models }) => {
    return await models.Product.findById(args.id);
  },
  allProducts: async (_parent, { input }, { models }) => {
    return await connectionHelper(models.Product, input);
  },
};

export const Mutation = {
  createProduct: authenticate(async (parent, { input }, { models, pubsub }) => {
    const imageCollection = await models.ImageCollection.create({
      images: [],
    });
    const product = await models.Product.create({
      title: input.title,
      description: input.description,
      price: input.price,
      path: input.path,
      status: input.status,
      imageCollection,
    });
    pubsub.publish('PRODUCT_ADDED', {
      productAdded: product,
    });
    return product;
  }),
  updateProduct: authenticate(async (parent, { input }, { models, pubsub }) => {
    const product = await models.Product.findById(input.id);
    if (!product) {
      throw new Error('Product not found!');
    }

    product.title = input.title || product.title;
    product.description = input.description || product.description;
    product.price = input.price || product.price;
    product.updatedAt = Date.now();
    product.path = input.path || product.path;
    product.status = input.status || product.status;

    if (input.imageCollection) {
      const imageCollection = await models.ImageCollection.findById(
        input.imageCollection
      );
      if (!imageCollection) {
        throw new Error('ImageCollection not found!');
      }
      product.imageCollection = imageCollection;
    }

    pubsub.publish('PRODUCT_UPDATED', {
      productUpdated: product,
    });
    return await product.save();
  }),
  removeProduct: authenticate(async (parent, args, { models, pubsub }) => {
    const product = await models.Product.findById(args.id);
    if (!product) {
      throw new Error('Product not found!');
    }
    pubsub.publish('PRODUCT_REMOVED', {
      productRemoved: product,
    });
    return await product.remove();
  }),
};

export const Subscription = {
  productAdded: {
    subscribe: (parent, args, { pubsub }) => {
      return pubsub.asyncIterator('PRODUCT_ADDED');
    },
  },
  productUpdated: {
    subscribe: (parent, args, { pubsub }) =>
      pubsub.asyncIterator('PRODUCT_UPDATED'),
  },
  productRemoved: {
    subscribe: (parent, args, { pubsub }) =>
      pubsub.asyncIterator('PRODUCT_REMOVED'),
  },
};

export const Product = {
  imageCollection: async (product, args, { models }) => {
    if (!product?.imageCollection) {
      return null;
    }
    const imageCollection = await models.ImageCollection.findById(
      product.imageCollection
    );
    return imageCollection;
  },
};
