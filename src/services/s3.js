// require('dotenv').config();

import S3 from 'aws-sdk/clients/s3.js';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import chalk from 'chalk';
import urlJoin from 'url-join';

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_ACCESS;

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey,
});

// Upload a file
export const uploadFile = async (
  file,
  destination = '',
  defaultFilename = null
) => {
  const { createReadStream, filename, mimetype } = await file;

  // read the data from the file.
  const fileStream = createReadStream();

  // in case of an error, log it.
  fileStream.on('error', (error) => console.error(error));

  const ext = path.extname(filename).toLowerCase();
  let imageName = uuidv4() + ext;

  if (defaultFilename) {
    imageName = defaultFilename + ext;
  }

  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: urlJoin(destination, imageName),
    ACL: 'public-read',
    ContentType: mimetype || 'application/octet-stream',
  };

  const result = await s3.upload(uploadParams).promise();
  if (!result) {
    console.error('Error: Upload Failed, uploadParams:', uploadParams);
  }
  return { filename: imageName, mimetype };
};

// Download a file
export const getFileStream = (fileKey) => {
  const downloadParams = {
    Key: fileKey,
    Bucket: bucketName,
  };

  return s3.getObject(downloadParams).createReadStream();
};

export const removeFile = async (filename, destination = '') => {
  const params = {
    Bucket: bucketName,
    Key: urlJoin(destination, filename),
  };

  try {
    await s3.deleteObject(params).promise();
    // console.log(chalk.green(`Successfully deleted file: ${filename}`));
  } catch (error) {
    console.log(chalk.red(`Failed Delete: ${filename}`));
    console.log('error', error);
  }
};
