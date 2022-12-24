module.exports = {
    seed: async(prisma) =>{
        await prisma.favorite.createMany({
            data: [
              {userId:1, postId:1},
              {userId:1, postId:2},
              {userId:1, postId:3},
              {userId:2, postId:3},
              {userId:3, postId:4},
              {userId:3, postId:1},
              {userId:3, postId:2},
            ]
          });
    }
}