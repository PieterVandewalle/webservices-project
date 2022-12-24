const fs = require("fs");
module.exports = {
    seed: async(prisma,imageContainerClient) => {
        //Delete unused images from azure storage
        const usedImagesPosts = await prisma.image.findMany({
            select:{
              blobName: true
            }
        });
        const usedImagesCategories = await prisma.category.findMany({
          select: {
            blobName: true
          }
        });
        

        //Images die gebruikt worden in seed herstellen
        fs.readdir("seedImages", async (err, files) => {
          await Promise.all(files.map((file) => {
              const data = fs.readFileSync(`seedImages/${file}`);
              const blockBlobClient = imageContainerClient.getBlockBlobClient(file);
              blockBlobClient.upload(data, data.length);
          }));
        });

        //Ongebruikte images verwijderen uit container
        const usedImages = [...usedImagesPosts, ...usedImagesCategories].map(({blobName}) => blobName);
        for await (const blob of imageContainerClient.listBlobsFlat()){
            if(!usedImages.includes(blob.name))
                await imageContainerClient.getBlockBlobClient(blob.name).delete();
        }
    }
}