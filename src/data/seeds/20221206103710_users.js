
module.exports = {
  seed: async (prisma) => {
        await prisma.user.createMany({
            data: [
                {
                    id: 1,
                    username: "SeedUser",
                    auth0id: "auth0|639f58d971bbf931397903e2",
                },
                {
                    id: 2,
                    username: "Bart45612",
                    auth0id: "auth0|638f0b7524184f927c64ce80",
                },
                {
                    id: 3,
                    username: "Albert12",
                    auth0id: "auth0|638f0bdd9dbdd4a604164cb5",
                }
            ]
        });
  },
};