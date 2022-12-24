const { PrismaClient } = require("@prisma/client");
const { resetDb} = require("./20221206103012_resetDb");
const { seed: seedUsers} = require("./20221206103710_users");
const { seed: seedPosts } = require("./20221206104430_posts");
const { seed: seedCategories } = require("./20221206105355_categories");
const { seed: seedDeliveryTypes } = require("./20221206105421_deliveryTypes");
const { seed: seedFavorites} = require("./20221206105620_favorites");
const { seed: seedConversations } = require("./20221206105810_conversations");
const { seed: seedImages } = require("./20221206125515_images");
const {getImageContainerClient, initializeAzureContainer} = require("../azure");
// Creates the azure containers if they do not exist yet
// Uploads the seed images to the seed images container

module.exports = {
    seed: async(prisma, imageContainerClient) => {
        let prismaInstance = prisma;
        let containerClient = imageContainerClient;

        // In production (om production db intitieel te seeden) en tijdens bij het migrate reset commando wil ik seed ook kunnen uitvoeren
        // Daarbij zou de data layer nog niet initialized zijn waardoor prisma, imageContainerClient en seedImageContainerClient
        // undefined zijn
        if(!prismaInstance){
            prismaInstance = new PrismaClient();
        }
        if(!imageContainerClient){
            await initializeAzureContainer();
            containerClient = getImageContainerClient();
        }

        await resetDb(prismaInstance);
        await seedCategories(prismaInstance);
        await seedDeliveryTypes(prismaInstance);
        await seedUsers(prismaInstance);
        await seedPosts(prismaInstance);
        await seedFavorites(prismaInstance);
        await seedConversations(prismaInstance);                                                                        
        await seedImages(prismaInstance, containerClient);
   }
}