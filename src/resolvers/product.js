import mongoose from 'mongoose';
import { authenticate } from '../middlewares/auth.js';

export const Query = {
  allProducts: async (parent, args, { models }) => {
    return await models.Product.find();
  },
  product: async (parent, args, { models }) => {
    return await models.Product.findById(args.id);
  },
};

export const Mutation = {
  createProduct: authenticate(async (parent, { input }, { models, pubsub }) => {
    const product = await models.Product.create({
      title: input.title,
      description: input.description,
      price: input.price,
      path: input.path,
    });
    pubsub.publish('PRODUCT_ADDED', { productAdded: product });
    return product;
  }),
  updateProduct: authenticate(async (parent, { input }, { models, pubsub }) => {
    const product = await models.Product.findById(input.id);
    if (!product) {
      throw new Error('Product not found!');
    }

    // Validate if the images exist
    if (input.images) {
      const filterObjectIds = input.images.filter((id) =>
        mongoose.Types.ObjectId.isValid(id)
      );
      for (const id of filterObjectIds) {
        const image = await models.Image.findById(id);
        if (!image) {
          throw new Error(`Image with id ${id} not found!`);
        }
      }
      product.images = filterObjectIds || product.images;
    }

    product.title = input.title || product.title;
    product.description = input.description || product.description;
    product.price = input.price || product.price;
    product.updatedAt = Date.now();
    product.path = input.path || product.path;

    pubsub.publish('PRODUCT_UPDATED', {
      productUpdated: { title: product.title },
    });
    return await product.save();
  }),
  removeProduct: authenticate(async (parent, args, { models }) => {
    const product = await models.Product.findById(args.id);
    if (!product) {
      throw new Error('Product not found!');
    }

    return await product.remove();
  }),
};

export const Subscription = {
  productAdded: {
    subscribe: (parent, args, { pubsub }) =>
      pubsub.asyncIterator('PRODUCT_ADDED'),
  },
  productUpdated: {
    subscribe: (parent, args, { pubsub }) =>
      pubsub.asyncIterator('PRODUCT_UPDATED'),
  },
};

export const Product = {
  images: async (product, args, { models }) => {
    if (!product.images || product.images.length === 0) {
      return [];
    }
    const images = await models.Image.find({
      _id: { $in: product.images, $type: 'objectId' },
    });
    return images;
  },
};
