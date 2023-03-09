import mongoose from 'mongoose';
import urlJoin from 'url-join';
import { authenticate } from '../middlewares/auth.js';
import { uploadFile } from '../services/s3.js';

export const Query = {
  allImageCollections: async (parent, args, { models }) => {
    return await models.ImageCollection.find();
  },
  imageCollection: async (parent, { id }, { models }) => {
    const imageCollection = await models.ImageCollection.findById(id);
    if (!imageCollection) {
      throw new Error('ImageCollection not found!');
    }
    return imageCollection;
  },
};

export const Mutation = {
  createImageCollection: authenticate(async (parent, { input }, { models }) => {
    const imageCollection = await models.ImageCollection.create({
      images: [],
    });
    if (input.images && input.images.length > 0) {
      const filterObjectIds = input.images.filter((id) =>
        mongoose.Types.ObjectId.isValid(id)
      );
      for (const id of filterObjectIds) {
        const image = await models.Image.findById(id);
        if (!image) {
          throw new Error(`Image with id ${id} not found!`);
        }
      }
      imageCollection.images = filterObjectIds || imageCollection.images;
    }
    return imageCollection;
  }),
  updateImageCollection: authenticate(async (parent, { input }, { models }) => {
    const imageCollection = await models.ImageCollection.findById(input.id);
    if (!imageCollection) {
      throw new Error('ImageCollection not found!');
    }

    if (input.images) {
      const filterObjectIds = input.images.filter((id) =>
        mongoose.Types.ObjectId.isValid(id)
      );
      for (const id of filterObjectIds) {
        const image = await models.Image.findById(id);
        if (!image) {
          throw new Error(`Image with id ${id} not found!`);
        }
      }
      imageCollection.images = filterObjectIds || imageCollection.images;
    }

    return imageCollection;
  }),
  removeImageCollection: authenticate(async (parent, { id }, { models }) => {
    const imageCollection = await models.ImageCollection.findById(id);
    if (!imageCollection) {
      throw new Error('ImageCollection not found!');
    }

    return await imageCollection.remove();
  }),
  removeImageFromImageCollection: authenticate(
    async (parent, { id, imageId }, { models }) => {
      const imageCollection = await models.ImageCollection.findById(id);
      if (!imageCollection) {
        throw new Error('ImageCollection not found!');
      }

      if (imageCollection.images.length > 0) {
        imageCollection.images = imageCollection.images.filter(
          (id) => id.toString() !== imageId
        );
      }

      return await imageCollection.save();
    }
  ),
  uploadImageToImageCollection: authenticate(
    async (parent, { id, file, alt }, { models }) => {
      const imageCollection = await models.ImageCollection.findById(id);
      if (!imageCollection) {
        throw new Error('ImageCollection not found!');
      }
      const rootDirectory = process.env.AWS_ROOT_DIRECTORY;
      const { filename, mimetype } = await uploadFile(file, rootDirectory);

      const image = await models.Image.create({
        fileName: filename,
        rootDirectory,
        url: urlJoin(
          process.env.AWS_BUCKET_PUBLIC_URL,
          rootDirectory,
          filename
        ),
        alt: alt || '',
        imageType: mimetype,
      });

      imageCollection.images.push(image.id);
      return await imageCollection.save();
    }
  ),
};

export const ImageCollection = {
  images: async (parent, args, { models }) => {
    if (!parent.images || parent.images.length === 0) {
      return [];
    }
    return await models.Image.find({ _id: { $in: parent.images } });
  },
};
