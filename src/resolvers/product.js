import { authenticate } from '../middlewares/auth.js';

export const Query = {
  product: async (parent, args, { models }) => {
    return await models.Product.findById(args.id);
  },
  allProducts: async (category, { input }, { models }) => {
    const { sort, limit, skip } = input || {};
    const query = models.Product.find();

    const sortField = sort?.field || 'title';
    const sortOrder = sort?.order === 'DESC' ? -1 : 1;
    const sortQuery = { [sortField]: sortOrder };
    const limitQuery = limit ? limit : 10;
    const skipQuery = skip ? skip : 0;

    query.skip(skipQuery);
    query.limit(limitQuery);
    query.sort(sortQuery);

    const nodes = await query;
    // const totalCount = await models.Product.countDocuments(filterQuery);
    const totalCount = await models.Product.countDocuments();
    const currentPage = Math.ceil(skipQuery / limitQuery) + 1;
    const pageCount = Math.ceil(totalCount / limitQuery);
    const hasPreviousPage = currentPage > 1;
    const hasNextPage = currentPage * limitQuery < totalCount;

    const pageInfo = {
      hasNextPage,
      hasPreviousPage,
      currentPage,
      itemCount: nodes.length,
      pageCount,
      perPage: limitQuery,
      totalCount,
    };

    return {
      nodes,
      pageInfo,
    };
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
