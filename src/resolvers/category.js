import { authenticate } from '../middlewares/auth.js';

export const Query = {
  allCategories: async (parent, args, { models }) => {
    return await models.Category.find();
  },
  category: async (parent, args, { models }) => {
    return await models.Category.findById(args.id);
  },
};

export const Mutation = {
  createCategory: authenticate(async (parent, { input }, { models }) => {
    return await models.Category.create({
      title: input.title,
      description: input.description,
      products: input.products,
      path: input.path,
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
  products: async (category, args, { models }) => {
    const products = await models.Product.find({
      _id: { $in: category.products, $type: 'objectId' },
    });
    return products;
  },
};
