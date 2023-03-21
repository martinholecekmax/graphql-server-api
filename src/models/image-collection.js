import mongoose from 'mongoose';

const ImageCollectionSchema = new mongoose.Schema({
  images: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Image',
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

const ImageCollection = mongoose.model(
  'ImageCollection',
  ImageCollectionSchema
);

export default ImageCollection;
