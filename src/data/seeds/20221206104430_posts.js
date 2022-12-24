const config = require("config");
const container = config.get("azure.imageContainer");
const baseUrl = config.get("azureBaseUrl");

module.exports = {
    seed: async (prisma) => {
          const post_1 =  prisma.post.create({
            data: {
              id: 1,
              date: "2022-12-14T10:50:29.786Z",
              title: "GeForce GTX 1070 ARMOR 8G OC",
              description: "MSI GeForce GTX 1070 ARMOR 8G OC 3x DisplayPort, DVI-D, HDMI zo goed als nieuw werkt nog perfect nooit overclockt Kan verzonden worden met Bpost",
              price: 170.75,
              categoryId: 1,
              deliveryTypeId: 1,
              userId: 1,
              city: "Hasselt",
              images: {
                createMany: {
                  data:  [
                    {
                        url: `${baseUrl}/${container}/geforcegrafischekaart.jpg`, blobName:"geforcegrafischekaart.jpg"
                    }, 
                    {
                        url: `${baseUrl}/${container}/geforcegtx1070.jpg`, blobName:"geforcegtx1070.jpg"
                    }
                ]
                }
              }
            },
          });
    
          const post_2 = await prisma.post.create({
            data: {
              id: 2,
              title: "AMD Ryzen 5 5500 Game PC / Gaming computer - GTX 1650 4GB",
              description: "Deze RGB game PC met Ryzen 5 5500 CPU en GTX 1650 videokaart is de perfecte keus voor een betaalbare gamecomputer, die toch alle moderne games kan draaien op medium tot high settings.",
              price: 679.00,
              categoryId: 2,
              deliveryTypeId: 3,
              userId: 2,
              city: "Brussel",
              images: {
                createMany: {
                  data: [
                        {
                            url:`${baseUrl}/${container}/amdryzen5.jfif`, blobName:'amdryzen5.jfif'
                        }, 
                        {
                            url:`${baseUrl}/${container}/amdryzen52.jfif`, blobName:'amdryzen52.jfif'
                        }
                    ]
                }
              }
            },
          });
        
          const post_3 = await prisma.post.create({
            data: {
              id: 3,
              title: "Laptop/Tablet Microsoft Surface Pro",
              description: "Convertable laptop tablet van Microsoft surface Pro 7, i3, 4GB RAM, 128gb met oplader Inclusief keybord met touch ID functie + bluetooth mouse van Logitech ",
              price: 600.25,
              categoryId: 4,
              deliveryTypeId: 3,
              userId: 3,
              city: "Leuven",
              images: {
                createMany: {
                    data: [
                        {
                            url:`${baseUrl}/${container}/laptopmicrosoftsurface.jpg`, blobName:"laptopmicrosoftsurface.jpg"
                        }, 
                        {
                            url:`${baseUrl}/${container}/microsoftsurface.png`, blobName:"microsoftsurface.png"
                        }
                    ]
                }
              }
            },
          });

          const post_4 = await prisma.post.create({
            data: {
              id: 4,
              title: "Moederbord te koop",
              description: "Gloednieuw moederbord te koop. In perfecte staat amper gebruikt want het was redelijk slecht.",
              price: 35.75,
              categoryId: 8,
              deliveryTypeId: 3,
              userId: 3,
              city: "Gent",
              images: {
                createMany: {
                  data: [
                        {
                            url:`${baseUrl}/${container}/moederbord.jfif`,blobName:"moederbord.jfif"
                        },
                        {
                            url:`${baseUrl}/${container}/moederbord2.webp`,blobName:"moederbord2.webp"
                        }, 
                        {
                            url:`${baseUrl}/${container}/moederbord3.jpg` ,blobName:"moederbord3.jpg"
                        }, 
                        {
                            url:`${baseUrl}/${container}/moederbord4.webp`,blobName:"moederbord4.webp"
                        },
                        {
                            url:`${baseUrl}/${container}/moederbord5.jpg` ,blobName:"moederbord5.jpg"
                        }
                    ]
                }
              }
            },
          });
        
          const post_5 = prisma.post.create({
            data: {
              id: 5,
              date: "2022-11-25T10:00:33.675Z",
              title: "Rtx 2060 GDDR6 12GB Topstaat als nieuw",
              description: "Bij deze bied ik deze rtx 2060 12GB videokaart aan in zeer goede staat moet niet weg wordt nog gebruikt .\r\nZit nu amper paar maandjes in mijn pc maar ik wil overschakelen naar een andere...\r\nDeze is 12GB en de meeste 2060 die je vind zijn maar 6 of 8GB kan alle recente games aan met goede fps (mw2/wz2) \r\nKan getest worden \r\nmvg",
              price: 249.5,
              categoryId: 1,
              deliveryTypeId: 1,
              userId: 2,
              city: "Melle",
              images: {
                createMany: {
                  data: [
                    {
        
                       url: `${baseUrl}/${container}/2022-11-25T100033.624Zrtx2060-3.jpg`,
                       blobName:"2022-11-25T100033.624Zrtx2060-3.jpg"
                    },
                    {
                        url: `${baseUrl}/${container}/2022-11-25T100033.626Zrtx2060-2.jpg`,
                        blobName:"2022-11-25T100033.626Zrtx2060-2.jpg"
                    },
                    {
                        url: `${baseUrl}/${container}/2022-11-25T100033.627Zrtx2060-1.jpg`,
                        blobName:"2022-11-25T100033.627Zrtx2060-1.jpg"
                    }
                  ]
                }
              },
          }
          });
        
         const post_6 =  prisma.post.create({
            data:{
                id: 6,
                date: "2022-11-25T10:15:07.056Z",
                title: "Ryzen 5 2600x + GTX 1060 6gb",
                description: "Te koop gaming PC:\r\n\r\nRyzen 5 2600x 6 cores (12 Threads)\r\nASRock steel legend B450 moederbord\r\n16gb ram Corsair 3000 Mhz\r\nGTX 1060 6gb\r\n250 gb SSD m .2 ( nieuw ) met Windows 10 pro op.\r\n1TB HDD voor je games ( Warzone + Overwatch geïnstalleerd om te testen )\r\n550 Watt voeding xilence\r\nCorsair case ( met andere (nieuwe) fans erin.) Case had geen fans\r\nFans en GPU zijn ook wit zodat alles past\r\nStofvrij + nieuwe koelpasta\r\nDrivers geüpdatet\r\n\r\nLiefst ophalen ( verzenden mogelijk op kosten en risico van de klant ).",
                price: 500,
                categoryId: 2,
                deliveryTypeId:3,
                userId: 1,
                city: "Antwerpen",
                images: {
                  createMany: {
                    data: [
                      {
                          url: `${baseUrl}/${container}/2022-11-25T101507.045Zdesktoppc-1.jpg`,
                          blobName:"2022-11-25T101507.045Zdesktoppc-1.jpg"
                      },
                      {
                          url: `${baseUrl}/${container}/2022-11-25T101507.046Zdesktoppc-2.jpg`,
                          blobName:"2022-11-25T101507.046Zdesktoppc-2.jpg"
                      },
                      {
                          url: `${baseUrl}/${container}/2022-11-25T101507.048Zdesktoppc-3.jpg`,
                          blobName:"2022-11-25T101507.048Zdesktoppc-3.jpg"
                      },
                      {
                          url: `${baseUrl}/${container}/2022-11-25T101507.049Zdesktoppc-4.jpg`,
                          blobName:"2022-11-25T101507.049Zdesktoppc-4.jpg"
                      }
                  ]
                  }
                }
            }
          });
        
          const post_7 = prisma.post.create({
            data: {
                id:7,
                date: "2022-10-25T10:50:29.786Z",
                title: "Zalman S4 - ATX - Micro ATX - Mini ITX - Behuizing",
                description: "De Zalman S4 computer behuizing is een Midi tower behuizing geschikt voor ATX, Micro-ATX en Mini-ITX moederborden. \r\nDe computer behuizing is voorzien van een transparant window.\r\n \r\nForm Factor Moederbord: ATX, Micro-ATX (uATX), Mini-ITX\r\n \r\nTechnische Specificaties:\r\n  Behuizingtype: Midi Tower\r\n  Form Factor: ATX, Micro-ATX (µATX), Mini-ITX\r\n \r\nAfmetingen:\r\n  Hoogte: 458mm\r\n  Breedte: 206mm\r\n  Diepte: 380mm\r\n ",
                price: 44.95,
                categoryId: 3,
                deliveryTypeId: 2,
                userId: 1,
                city: "Oostende",
                images: {
                  createMany: {
                    data: [
                      {
                          url: `${baseUrl}/${container}/2022-11-25T105029.780Zcase-2.jpg`,
                          blobName:"2022-11-25T105029.780Zcase-2.jpg"
                      },
                      {
                          url: `${baseUrl}/${container}/2022-11-25T105029.780Zcase-1.jpg`,
                          blobName:"2022-11-25T105029.780Zcase-1.jpg"
                      }
                  ],
                  }
                }
            }
          });

          const post_8 = prisma.post.create({
            data: {
                id:8,
                title: "MSI GeForce RTX 3080 Ti GAMING X TRIO 12G",
                description: "Licht op als nooit tevoren!\r\nNu kunt u de verlichting synchroniseren met andere compatibele apparaten om een licht- en effectshow te creëren. \r\nTorx 4.0-ventilatorparen zijn gekoppeld aan een externe ringaansluiting waarmee de luchtstroom in het TRI FROZR 2-koelsysteem kan worden geconcentreerd .\r\nGeen buiging om de structuur van de videokaart te versterken, we garanderen dat er een steunbeugel aan de behuizing wordt bevestigd voor extra versteviging. \r\nNVIDIA DLSS is een revolutionaire AI-rendering die de framesnelheid verhoogt met compromisloze beeldkwaliteit dankzij Tensor Cores.",
                price: 1525,
                categoryId: 1,
                deliveryTypeId: 2,
                userId: 1,
                city: "Leuven",
                images: {
                  createMany: {
                    data: [
                      {
                          url: `${baseUrl}/${container}/graphics_card_1.jpg`,
                          blobName:"graphics_card_1.jpg"
                      },
                      {
                        url: `${baseUrl}/${container}/graphics_card_2.jpg`,
                        blobName:"graphics_card_2.jpg"
                      },
                      {
                        url: `${baseUrl}/${container}/graphics_card_3.jpg`,
                        blobName:"graphics_card_3.jpg"
                      },
                  ],
                  }
                }
            }
          });
          const post_9 = prisma.post.create({
            data: {
                id:9,
                date: "2022-12-15T12:16:31.936Z",
                title: "Asus VS247HR monitor",
                description: "Schermdiagonaal: 23,6\"\r\nVideo in: DVI-D, HDMI, VGA (D-Sub)\r\nResolutie: 1920x1080 (Full HD)\r\nReactietijd: 2ms\r\nRefreshrate: 75Hz\r\n\r\nExtra info nodig? Contacteer mij gerust :)",
                price: 75,
                categoryId: 7,
                deliveryTypeId: 2,
                userId: 2,
                city: "Lokeren",
                images: {
                  createMany: {
                    data: [
                      {
                          url: `${baseUrl}/${container}/monitor_1.jfif`,
                          blobName:"monitor_1.jfif"
                      },
                      {
                        url: `${baseUrl}/${container}/monitor_2.jfif`,
                        blobName:"monitor_2.jfif"
                      },
                  ],
                  }
                }
            }
          });

          const post_10 = prisma.post.create({
            data: {
                id:10,
                date: "2022-10-15T12:16:31.936Z",
                title: "Realtek Ethernet Kaart",
                description: "Realtek GTS FC-515LS Ethernet NETWORK CARD\r\n\r\n- Interne LAN kaart.\r\n- Snelheid 10/100",
                price: 1.5,
                categoryId: 9,
                deliveryTypeId: 1,
                userId: 3,
                city: "Genk",
                images: {
                  createMany: {
                    data: [
                      {
                          url: `${baseUrl}/${container}/network_card_1.jfif`,
                          blobName:"network_card_1.jfif"
                      },
                  ],
                  }
                }
            }
          });

          const post_11 = prisma.post.create({
            data: {
                id:11,
                title: "PLAYSTATION 4 PRO 1TB HDD GLACIER WHITE",
                description: "PLAYSTATION 4 PRO 1TB HDD GLACIER WHITE\r\n\r\nHierbij bied ik mijn Special Edition PlayStation 4 Pro in de kleur Glacier White aan met 1 Terrabyte harde schijf en originele doos.\r\nDaarnaast krijgt u bij deze Ps4 ook een extra (nieuw model) DualShock controller 4 (dus 2 stuks totaal), stroomkabel en Monoheadset.\r\n\r\nDeze Playstation is weinig gebruikt en verkeerd in perfecte staat. Uiteraard kan deze bij afhalen (in Maasmechelen) werkend gezien en erop gespeeld worden. Verzekerd verzenden is ook mogelijk.\r\n\r\nPlaystation 4 Pro (info van Sony)\r\nDe PlayStation 4 Pro levert een verbeterde visuele game-ervaring en ondersteuning voor 4K resoluties via grafische rendering of upscaling.\r\n\r\nDankzij een nieuwe CPU en GPU, kunnen de graphics in spellen met veel meer details en een ongekende visuele precisie weergegeven worden. Als je over een 4K televisie beschikt, kan je van alle PS4 titels genieten in een hogere kwaliteit, dankzij 4K upscaling en snellere of stabielere framerates. Daarnaast ondersteunt de PS4 Pro 4K videoweergave van video streaming services, zoals Netflix en YouTube. Je hoeft echter geen nieuwe 4K televisie aan te schaffen om te genieten van de verbeterde gameplayervaringen op de PS4 Pro. Op je HDTV levert het systeem 1080p-resoluties voor alle PS4 games en hogere of stabielere framerates voor de titels die dit ondersteunen.",
                price: 495,
                categoryId: 20,
                deliveryTypeId: 3,
                userId: 1,
                city: "Knokke",
                images: {
                  createMany: {
                    data: [
                      {
                          url: `${baseUrl}/${container}/ps5_1.jfif`,
                          blobName:"ps5_1.jfif"
                      },
                      {
                        url: `${baseUrl}/${container}/ps5_2.jfif`,
                        blobName:"ps5_2.jfif"
                    },
                  ],
                  }
                }
            }
          });

          await Promise.all([post_1, post_2, post_3, post_4, post_5, post_6, post_7, post_8, post_9, post_10, post_11]);
        }
}