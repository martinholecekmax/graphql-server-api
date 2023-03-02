import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import chalk from 'chalk';
import urlJoin from 'url-join';

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_ACCESS;

const client = new S3Client({
  region,
  credentials: {
    secretAccessKey,
    accessKeyId,
  },
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

  const Key = urlJoin(destination, imageName);
  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: Key,
    ACL: 'public-read',
    ContentType: mimetype || 'application/octet-stream',
  };

  try {
    const command = new Upload({
      client,
      params: uploadParams,
    });
    await command.done();
    return { filename: imageName, mimetype };
  } catch (error) {
    console.log(chalk.red('Error: Upload Failed, uploadParams:', uploadParams));
    console.log('error', error);
    throw error;
  }
};

// Download a file
export const getFileStream = (fileKey) => {
  const downloadParams = {
    Key: fileKey,
    Bucket: bucketName,
  };

  return client.getObject(downloadParams).createReadStream();
};

export const removeFile = async (filename, destination = '') => {
  const params = {
    Bucket: bucketName,
    Key: urlJoin(destination, filename),
  };

  try {
    await client.send(new DeleteObjectCommand(params));
    console.log(chalk.green(`Successfully deleted file: ${filename}`));
  } catch (error) {
    console.log(chalk.red(`Failed Delete: ${filename}`));
    console.log('error', error);
  }
};
