import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  title: String,
  path: String,
  description: String,
  price: Number,
  status: String,
  imageCollection: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ImageCollection',
  },
  productCollection: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductCollection',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Product = mongoose.model('Product', ProductSchema);

export default Product;
