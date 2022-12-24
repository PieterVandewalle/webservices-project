const {
    initializeData,
    shutdownData
} = require("../../src/data");
const {
    getImageContainerClient
} = require("../../src/data/azure");

const fs = require("fs");
const {
    deleteBlobs
} = require("../../src/core/image");
const {
    initializeLoggerInUnitTests
} = require("../helpers");
describe('Image', () => {
    initializeLoggerInUnitTests();
    describe('deleteBlobs', () => {
        const blobNames = ["image0.jfif", "image1.jfif", "image2.jfif"];
        beforeAll(async () => {
            await initializeData();
            const containerClient = getImageContainerClient();
            await Promise.all(blobNames.map(blobName => {
                const data = fs.readFileSync(`__tests__/testimages/${blobName}`);
                const blockBlobClient = containerClient.getBlockBlobClient(blobName);
                blockBlobClient.upload(data, data.length);
            }));
        });

        afterAll(async () => {
            const containerClient = getImageContainerClient();
            // testimages container
            for await (const blob of containerClient.listBlobsFlat()) {
                await containerClient.getBlockBlobClient(blob.name).delete();
            }
            await shutdownData();
        });


        it('should delete all image blobs with the given blobNames', async () => {
            const containerClient = getImageContainerClient();
            await deleteBlobs(...blobNames);
            const filesStillExist = await Promise.all(blobNames.map(blobName => containerClient.getBlockBlobClient(blobName).exists()));
            filesStillExist.forEach(exists => {
                expect(exists).toBe(false);
            });
        });

    });
});