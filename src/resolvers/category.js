import { authenticate } from '../middlewares/auth.js';
import { connectionHelper } from '../utils/connection.js';

export const Query = {
  // fix: async (parent, args, { models }) => {
  //   const categories = await models.Category.find();
  //   for (const category of categories) {
  //     const cat = await models.Category.findById(category._id);
  //     const productCollection = await models.ProductCollection.create({
  //       products: [],
  //     });
  //     cat.productCollection = productCollection;
  //     await cat.save();
  //     console.log('cat', cat);
  //   }
  //   return null;
  // },
  category: async (_parent, args, { models }) => {
    return await models.Category.findById(args.id);
  },
  allCategories: async (_parent, { input }, { models }) => {
    return connectionHelper(models.Category, input);
  },
};

export const Mutation = {
  createCategory: authenticate(async (parent, { input }, { models }) => {
    const productCollection = await models.ProductCollection.create({
      products: [],
    });
    return await models.Category.create({
      title: input.title,
      description: input.description,
      path: input.path,
      productCollection,
    });
  }),
  updateCategory: authenticate(async (parent, { input }, { models }) => {
    const category = await models.Category.findById(input.id);
    if (!category) {
      throw new Error('Category not found!');
    }

    category.title = input.title || category.title;
    category.description = input.description || category.description;
    category.products = input.products || category.products;
    category.updatedAt = Date.now();
    category.path = input.path || category.path;

    return await category.save();
  }),
  removeCategory: authenticate(async (parent, args, { models }) => {
    const category = await models.Category.findById(args.id);
    if (!category) {
      throw new Error('Category not found!');
    }

    return await category.remove();
  }),
};

export const Category = {
  productCollection: async (category, _, { models }) => {
    if (category.productCollection) {
      return await models.ProductCollection.findById(
        category.productCollection
      );
    }
    return [];
  },
  // productCollection: async (category, { input }, { models }) => {
  //   if (category.productCollection) {
  //     return {
  //       nodes: [],
  //       pageInfo: {
  //         hasNextPage: false,
  //         hasPreviousPage: false,
  //         currentPage: 1,
  //         itemCount: 0,
  //         pageCount: 1,
  //         perPage: 10,
  //         totalCount: 0,
  //       },
  //     };
  //   }

  //   const productCollection = models.ProductCollection.findById(
  //     category.productCollection
  //   );

  //   const filterQuery = {
  //     _id: { $in: productCollection.products, $type: 'objectId' },
  //   };

  //   const { skip, limit, sort } = input;

  //   const query = models.Product.find(filterQuery);

  //   const sortField = sort?.field || 'title';
  //   const sortOrder = sort?.order === 'DESC' ? -1 : 1;
  //   const sortQuery = { [sortField]: sortOrder };
  //   const limitQuery = limit ? limit : 10;
  //   const skipQuery = skip ? skip : 0;

  //   query.skip(skipQuery);
  //   query.limit(limitQuery);
  //   query.sort(sortQuery);

  //   const nodes = await query;
  //   const totalCount = await models.Product.countDocuments(filterQuery);
  //   const currentPage = Math.ceil(skipQuery / limitQuery) + 1;
  //   const pageCount = Math.ceil(totalCount / limitQuery);
  //   const hasPreviousPage = currentPage > 1;
  //   const hasNextPage = currentPage * limitQuery < totalCount;

  //   const pageInfo = {
  //     hasNextPage,
  //     hasPreviousPage,
  //     currentPage,
  //     itemCount: nodes.length,
  //     pageCount,
  //     perPage: limitQuery,
  //     totalCount,
  //   };

  //   return {
  //     nodes,
  //     pageInfo,
  //   };
  // },
};
