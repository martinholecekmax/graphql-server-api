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
  uploadImageToImageCollection: authenticate(
    async (parent, { id, image }, { models }) => {
      const imageCollection = await models.ImageCollection.findById(id);
      if (!imageCollection) {
        throw new Error('ImageCollection not found!');
      }

      if (!image.file) {
        throw new Error('No file provided!');
      }

      const rootDirectory = process.env.AWS_ROOT_DIRECTORY;
      const { filename, mimetype } = await uploadFile(
        image.file,
        rootDirectory
      );

      const imageModel = await models.Image.create({
        fileName: filename,
        rootDirectory,
        alt: image.alt || '',
        imageType: mimetype,
        url: urlJoin(
          process.env.AWS_BUCKET_PUBLIC_URL,
          rootDirectory,
          filename
        ),
      });

      imageCollection.images.push(imageModel.id);
      return await imageCollection.save();
    }
  ),
  updateImageInCollection: authenticate(
    async (_, { id, image }, { models }) => {
      const imageCollection = await models.ImageCollection.findById(id);
      if (!imageCollection) {
        throw new Error('Invalid Image Collection ID!');
      }

      const imageModel = await models.Image.findById(image.id);
      if (!imageModel) {
        throw new Error('Invalid Image ID!');
      }

      if (image.file) {
        const rootDirectory = process.env.AWS_ROOT_DIRECTORY;
        const { filename, mimetype } = await uploadFile(
          image.file,
          rootDirectory
        );

        imageModel.fileName = filename;
        imageModel.imageType = mimetype;
        imageModel.rootDirectory = rootDirectory;
        imageModel.url = urlJoin(
          process.env.AWS_BUCKET_PUBLIC_URL,
          rootDirectory,
          filename
        );
      }

      imageModel.alt = image.alt || imageModel.alt;
      imageModel.caption = image.caption || imageModel.caption;
      imageModel.updatedAt = new Date();

      await imageModel.save();
      return imageCollection;
    }
  ),
  removeImageFromImageCollection: authenticate(
    async (parent, { id, imageId }, { models }) => {
      const imageCollection = await models.ImageCollection.findById(id);
      if (!imageCollection) {
        throw new Error('ImageCollection not found!');
      }

      // if (imageCollection.images.length > 0) {
      //   imageCollection.images = imageCollection.images.filter(
      //     (id) => id.toString() !== imageId
      //   );
      // }

      await imageCollection.updateOne({
        $pull: { images: { $in: [imageId] } },
      });

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
