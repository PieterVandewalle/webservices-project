const config = require('config');

const VALID_FILE_TYPES = ["image/jpg", "image/jpeg", "image/png"];
const multer = require('@koa/multer');
const MulterAzureStorage = require('multer-azure-blob-storage').MulterAzureStorage;
const AZURE_STORAGE_CONNECTION_STRING = config.get('azureStorageConnectionString');
const containerName = config.get("azure.imageContainer");
const { MulterError } = require('multer');
const { getImageContainerClient } = require('../data/azure');


const resolveBlobName = (req, file) => {
  return new Promise((resolve, reject) => {
      const blobName = new Date().getTime() + file.originalname;
      resolve(blobName);
  });
};

const azureStorage = new MulterAzureStorage({
  connectionString: AZURE_STORAGE_CONNECTION_STRING,
  containerName: containerName,
  blobName: resolveBlobName,
  containerAccessLevel: 'blob',
  urlExpirationTime: 60
});

const fileFilter = (req, file, cb) => {
  if(VALID_FILE_TYPES.includes(file.mimetype)){
    return cb(null, true);
  }
  return cb(new MulterError('LIMIT_FILE_MIMETYPE', `File mimetype not allowed. Allowed types are: ${JSON.stringify(VALID_FILE_TYPES)}`));
}

const upload = multer({
  storage: azureStorage,
  limits: {
    fileSize: 1024 * 1024 * 10
  },
  fileFilter: fileFilter
});

const createUploadMiddleware = (numberOfImages) =>  {
  return async(ctx, next) => {
    try {
      numberOfImages === 1 ? await upload.single("image")(ctx, next) : await upload.array("image",numberOfImages)(ctx, next);
    } catch(error){
      if(error instanceof MulterError === false)
        throw error;

      let errorMessage = error.code === "LIMIT_FILE_SIZE" ? `${error.message}, max 10MB!` : error.code === "LIMIT_UNEXPECTED_FILE" ? `${error.message}, max ${numberOfImages} image(s) allowed` : error.message;
      ctx.throw(400, 'Upload validation failed, check details for more information', {
        code: error.code,
        details: errorMessage,
      });
    }
  };
}

const addFilesToImageObject = async(ctx, next) => {
  const previousImages = ctx.request.body.images ? JSON.parse(ctx.request.body.images) : [];
  const newImages = ctx.files?.map(({blobName, url}) => ({blobName, url: url.split("?")[0]}));
  ctx.request.body.images = ([...previousImages, ...newImages]);
  await next();
}

const addFileToCategoryObject = async(ctx, next) => {
  if(ctx.file)
    ctx.request.body.imageUrl = ctx.file.url.split("?")[0];
    ctx.request.body.blobName = ctx.file.blobName;
  await next();
}

const deleteBlobs = async(...blobNames) => {
  if(!blobNames)
    return;
  const containerClient = getImageContainerClient();
  await Promise.all(blobNames.map(blobName => containerClient.getBlockBlobClient(blobName).deleteIfExists()));
}

module.exports = {
  deleteBlobs,
  addFileToCategoryObject,
  addFilesToImageObject,
  createUploadMiddleware
}

