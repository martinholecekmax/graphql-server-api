import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  title: String,
  path: String,
  description: String,
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

const Category = mongoose.model('Category', CategorySchema);

export default Category;
