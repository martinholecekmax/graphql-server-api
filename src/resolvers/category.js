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
  createCategory: authenticate(async (parent, args, { models }) => {
    return await models.Category.create({
      title: args.title,
      description: args.description,
      products: args.products,
    });
  }),
  updateCategory: authenticate(async (parent, args, { models }) => {
    const category = await models.Category.findById(args.id);
    if (!category) {
      throw new Error('Category not found!');
    }

    category.title = args.title || category.title;
    category.description = args.description || category.description;
    category.products = args.products || category.products;

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
