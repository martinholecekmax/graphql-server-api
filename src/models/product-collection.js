import mongoose from 'mongoose';

const ProductCollectionSchema = new mongoose.Schema({
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const ProductCollection = mongoose.model(
  'ProductCollection',
  ProductCollectionSchema
);

export default ProductCollection;
