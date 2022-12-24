module.exports = {
    seed: async(prisma) => {
        await prisma.conversation.create({
            data: {
              postId: 1, 
                postOwnerId:1, 
                postReplierId: 2,
                messages: {
                  createMany: {
                    data: [
                      {senderId: 2, content: "Ik heb interesse in je zoekertje, wanneer zou ik erom kunnen komen?"},
                      {senderId: 1, content: "Deze avond lukt voor mij"},
                      {senderId: 2, content: "Oke wat is je adres?"},
                      {senderId: 1, content: "Berkenlaan 25, 8000 Brugge"},
                      {senderId: 2, content: "Oke, ik zal er zijn rond 8 uur"},
                    ]
                  }
              }
            }
          });
    }
}