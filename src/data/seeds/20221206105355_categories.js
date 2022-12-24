const config = require("config");
const container = config.get("azure.imageContainer");
const baseUrl = config.get("azureBaseUrl");

module.exports = {
    seed: async(prisma) =>{
          await prisma.category.createMany({
            data:[
              {id: 1, name: "Graphics Cards",blobName: "cat-graphics-cards.webp", imageUrl: `${baseUrl}/${container}/cat-graphics-cards.webp`},
              {id: 2, name: "Desktop PCs",blobName:"cat-desktop-pcs.webp", imageUrl: `${baseUrl}/${container}/cat-desktop-pcs.webp`},
              {id: 3, name: "Computer Cases",blobName:"cat-computer-cases.webp",imageUrl: `${baseUrl}/${container}/cat-computer-cases.webp`},
              {id: 4, name: "Windows Laptops",blobName:"cat-windows-laptops.webp" ,imageUrl: `${baseUrl}/${container}/cat-windows-laptops.webp`},
              {id: 5, name: "Apple Desktops",blobName:"cat-apple-desktops.webp",imageUrl: `${baseUrl}/${container}/cat-apple-desktops.webp`},
              {id: 6, name: "Network Cables",blobName:"cat-network-cables.webp",imageUrl: `${baseUrl}/${container}/cat-network-cables.webp`},
              {id: 7, name: "Monitors",blobName:"cat-monitors.webp", imageUrl: `${baseUrl}/${container}/cat-monitors.webp`},
              {id: 8, name: "Motherboards",blobName:"cat-motherboards.webp",imageUrl: `${baseUrl}/${container}/cat-motherboards.webp`},
              {id: 9, name: "Network Cards",blobName:"cat-network-cards.webp" ,imageUrl: `${baseUrl}/${container}/cat-network-cards.webp`},
              {id: 10, name: "RAM",blobName:"cat-ram.webp", imageUrl: `${baseUrl}/${container}/cat-ram.webp`},
              {id: 11, name: "Processors",blobName: "cat-processors.webp" ,imageUrl: `${baseUrl}/${container}/cat-processors.webp`},
              {id: 12, name: "CPU Coolers",blobName:"cat-cpu-coolers.webp", imageUrl: `${baseUrl}/${container}/cat-cpu-coolers.webp`},
              {id: 13, name: "Power Supplies",blobName:"cat-power-supplies.webp" ,imageUrl: `${baseUrl}/${container}/cat-power-supplies.webp`},
              {id: 14, name: "Apple Laptops",blobName:"cat-apple-laptops.webp" ,imageUrl: `${baseUrl}/${container}/cat-apple-laptops.webp`},
              {id: 15, name: "Chromebooks",blobName:"cat-chromebooks.webp" , imageUrl: `${baseUrl}/${container}/cat-chromebooks.webp`},
              {id: 16, name: "Sound cards",blobName:"cat-sound-cards.webp" ,imageUrl: `${baseUrl}/${container}/cat-sound-cards.webp`},
              {id: 17, name: "Laptop chargers",blobName:"cat-laptop-chargers.webp",imageUrl: `${baseUrl}/${container}/cat-laptop-chargers.webp`},
              {id: 18, name: "Network switches",blobName:"cat-network-switches.webp", imageUrl: `${baseUrl}/${container}/cat-network-switches.webp`},
              {id: 19, name: "Hard drives",blobName:"cat-hard-drives.webp" ,imageUrl: `${baseUrl}/${container}/cat-hard-drives.webp`},
              {id: 20, name: "Other",blobName:"cat-other.webp", imageUrl: `${baseUrl}/${container}/cat-other.webp`}
            ]
          });
    }
}