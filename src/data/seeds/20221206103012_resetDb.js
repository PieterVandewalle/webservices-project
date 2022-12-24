const{ Prisma} = require('@prisma/client');

module.exports = {
    resetDb: async (prisma) => {
        const tableNames = Prisma.dmmf.datamodel.models.map((model) => model.name);
        for(const tableName of tableNames){
            await prisma.$executeRawUnsafe(`DELETE FROM ${tableName};`)
            await prisma.$executeRawUnsafe(`ALTER TABLE ${tableName} AUTO_INCREMENT = 1;`);
        }
    },
  };