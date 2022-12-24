module.exports = {
    seed: async(prisma) =>{
        await prisma.deliveryType.createMany({
            data: [
                {id: 1, name:"Pick up"},
                {id: 2, name:"Ship"},
                {id: 3, name:"Pick up or ship"},
            ]
        })
    }
}