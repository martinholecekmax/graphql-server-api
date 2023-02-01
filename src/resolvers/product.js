import mongoose from 'mongoose';

export const Query = {
  allProducts: async (parent, args, { models }) => {
    return await models.Product.find();
  },
};

export const Mutation = {
  createProduct: async (parent, args, { models, pubsub }) => {
    pubsub.publish('PRODUCT_ADDED', { productAdded: { title: args.title } });
    return await models.Product.create({
      title: args.title,
      description: args.description,
      price: args.price,
    });
  },
  updateProduct: async (parent, args, { models, pubsub }) => {
    const product = await models.Product.findById(args.id);
    if (!product) {
      throw new Error('Product not found!');
    }

    // Validate if the images exist
    if (args.images) {
      const filterObjectIds = args.images.filter((id) =>
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

    product.title = args.title || product.title;
    product.description = args.description || product.description;
    product.price = args.price || product.price;

    pubsub.publish('PRODUCT_UPDATED', {
      productUpdated: { title: product.title },
    });
    return await product.save();
  },
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
    const images = await models.Image.find({
      _id: { $in: product.images, $type: 'objectId' },
    });
    return images;
  },
};
