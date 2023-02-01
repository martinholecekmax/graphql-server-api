import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  title: String,
  description: String,
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
});

const Category = mongoose.model('Category', CategorySchema);

export default Category;
