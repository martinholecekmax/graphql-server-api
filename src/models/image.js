import mongoose from 'mongoose';

const ImageSchema = new mongoose.Schema({
  fileName: String,
  url: String,
  alt: String,
  imageType: String,
  rootDirectory: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Image = mongoose.model('Image', ImageSchema);

export default Image;
