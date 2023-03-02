import urlJoin from 'url-join';
import { authenticate } from '../middlewares/auth.js';
import { uploadFile } from '../services/s3.js';

export const Query = {
  allImages: async (parent, args, { models }) => {
    return await models.Image.find();
  },
};

export const Mutation = {
  uploadImage: authenticate(async (parent, args, { models }) => {
    const { file } = args;
    if (!file) {
      throw new Error('No file provided!');
    }

    const rootDirectory = process.env.AWS_ROOT_DIRECTORY;
    const { filename, mimetype } = await uploadFile(file, rootDirectory);

    return await models.Image.create({
      fileName: filename,
      rootDirectory,
      url: urlJoin(process.env.AWS_BUCKET_PUBLIC_URL, rootDirectory, filename),
      alt: args.alt || '',
      imageType: mimetype,
    });
  }),
  removeImage: authenticate(async (parent, args, { models }) => {
    const image = await models.Image.findById(args.id);
    if (!image) {
      throw new Error('Image not found!');
    }

    /// Uncomment this code to remove the image from S3
    // try {
    //   await removeFile(image.fileName, image.rootDirectory);
    // } catch (error) {
    //   console.log(error);
    // }

    return await image.remove();
  }),
};
