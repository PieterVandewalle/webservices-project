const {getLogger} = require('../core/logging');
const emoji = require("node-emoji");
const { PrismaClient} = require('@prisma/client');
const config = require('config');
const NODE_ENV = config.get('env');
const isDevelopment = NODE_ENV === 'development';
const { seed } = require('./seeds');
const { getImageContainerClient, initializeAzureContainer} = require('./azure');


let prismaInstance;

const getPrismaLogger = (logger, level) => (event) => {
    if (event.query) {
      logger.log(level, event.query);
    } else {
      logger.log(level, event.message);
    }
};


const initializeData= async() => {
    const logger = getLogger();
    logger.info(`${emoji.get("card_file_box")}  Initializing connection to the database`);

    prismaInstance = new PrismaClient({
        errorFormat: 'minimal',
        log: [
            { level: 'warn', emit: 'event' },
            { level: 'error', emit: 'event' },
            { level: 'query', emit: 'event' },
            { level: 'info', emit: 'event' },
        ]
    });
    const queryLog = getPrismaLogger(logger, "debug");
    const infoLog = getPrismaLogger(logger, "debug");
    const warnLog = getPrismaLogger(logger, "warn");
    const errorLog = getPrismaLogger(logger, "error");
    
    //https://www.prisma.io/docs/concepts/components/prisma-client/working-with-prismaclient/logging
    prismaInstance.$on('query', queryLog);
    prismaInstance.$on('info', infoLog);
    prismaInstance.$on('warn', warnLog);
    prismaInstance.$on('error',errorLog);

    try {
        await prismaInstance.$queryRaw`SELECT 1+1 AS result`;
    }catch(error){
        logger.error(`Database not intitalized: run ${isDevelopment ? "prisma migrate dev" : "prisma migrate deploy"} first`, { error });
        throw new Error("Could not initialize the data layer.");
    }

    try {
        await initializeAzureContainer();
    } catch(error){
        logger.error('Error creating azure container', {error});
        throw error;
    }

    if(isDevelopment) {
        try {
            const client = getImageContainerClient();
            await seed(prismaInstance, client);
        } catch(error) {
            logger.error(`Error seeding the database`, { error });
        }
    }

    logger.info(`${emoji.get("card_file_box")}  Database initialized successfully`);
}

/**
 * Get the Prisma instance
 *
 * @returns The prismaInstance
 */
const getPrisma = () => {
    if (!prismaInstance)
        throw new Error('Please initialize the data layer before getting the Prisma instance');
    return prismaInstance;
}

const shutdownData = async() => {
    const logger = getLogger();
    logger.info('Shutting down database connection');
    await prismaInstance.$disconnect();
    prismaInstance = null;
}

module.exports = {initializeData, shutdownData, getPrisma};