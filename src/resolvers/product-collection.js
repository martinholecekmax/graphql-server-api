import mongoose from 'mongoose';
import { authenticate } from '../middlewares/auth.js';

export const Query = {
  productCollection: async (parent, { id }, { models }) => {
    const productCollection = await models.ProductCollection.findById(id);
    if (!productCollection) {
      throw new Error('ProductCollection not found!');
    }
    return productCollection;
  },
};

export const Mutation = {
  createProductCollection: authenticate(
    async (parent, { input }, { models }) => {
      const productCollection = await models.ProductCollection.create({
        products: [],
      });
      if (input.products) {
        const filterObjectIds = input.products.filter((id) =>
          mongoose.Types.ObjectId.isValid(id)
        );
        for (const id of filterObjectIds) {
          const product = await models.Product.findById(id);
          if (!product) {
            throw new Error(`Product with id ${id} not found!`);
          }
        }
        productCollection.products =
          filterObjectIds || productCollection.products;
      }
      return productCollection;
    }
  ),
  removeProductCollection: authenticate(async (parent, { id }, { models }) => {
    const productCollection = await models.ProductCollection.findById(id);
    if (!productCollection) {
      throw new Error('ProductCollection not found!');
    }
    return await productCollection.remove();
  }),
  addProductToCollection: authenticate(
    async (parent, { id, product }, { models }) => {
      const productCollection = await models.ProductCollection.findById(id);
      if (!productCollection) {
        throw new Error('ProductCollection not found!');
      }
      if (product) {
        const foundProduct = await models.Product.findById(product);
        if (!foundProduct) {
          throw new Error(`Product with id ${product} not found!`);
        }
        if (productCollection.products) {
          productCollection.products.push(foundProduct);
        } else {
          productCollection.products = [foundProduct];
        }
      }
      return await productCollection.save();
    }
  ),
  removeProductFromCollection: authenticate(
    async (parent, { id, product }, { models }) => {
      const productCollection = await models.ProductCollection.findById(id);
      if (!productCollection) {
        throw new Error('ProductCollection not found!');
      }

      await productCollection.updateOne({
        $pull: { products: { $in: [product] } },
      });

      return await productCollection.save();
    }
  ),
};

export const ProductCollection = {
  products: async (parent, { input }, { models }) => {
    const { skip, limit, sort } = input || {};
    const filterQuery = { _id: { $in: parent.products } };

    const query = models.Product.find(filterQuery);

    const sortField = sort?.field || 'title';
    const sortOrder = sort?.order === 'DESC' ? -1 : 1;
    const sortQuery = { [sortField]: sortOrder };
    const limitQuery = limit ? limit : 10;
    const skipQuery = skip ? skip : 0;

    query.skip(skipQuery);
    query.limit(limitQuery);
    query.sort(sortQuery);

    const nodes = await query;
    const totalCount = await models.Product.countDocuments(filterQuery);
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
