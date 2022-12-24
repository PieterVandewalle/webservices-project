const {BlobServiceClient} = require('@azure/storage-blob');
const config = require("config");

const containerName = config.get("azure.imageContainer");
const blobServiceClient = BlobServiceClient.fromConnectionString(config.get("azureStorageConnectionString"));

let imageContainerClient;

// Creates the azure containers if they do not exist yet
// Uploads the seed images to the seed images container
const initializeAzureContainer = async() => {
    imageContainerClient = blobServiceClient.getContainerClient(containerName);
    await imageContainerClient.createIfNotExists();
    await imageContainerClient.setAccessPolicy('blob');
}

const getImageContainerClient = () => {
    if(!imageContainerClient){
        throw new Error('Please initialize the data layer before getting the Container client');
    }
    return imageContainerClient;
}

module.exports = {
   initializeAzureContainer, getImageContainerClient, blobServiceClient,
}