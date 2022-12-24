const config = require("config");
const {
    withServer
} = require("../helpers");

const container = config.get("azure.imageContainer");
const azureBaseUrl = config.get("azureBaseUrl");
const fs = require("fs");
const path = require("path");
const {
    getImageContainerClient
} = require("../../src/data/azure");

const data = {
    posts: [{
            id: 1,
            date: "2022-11-25T10:15:07.056Z",
            title: "Ryzen 5 2600x + GTX 1060 6gb",
            description: "Te koop gaming PC:\r\n\r\nRyzen 5 2600x 6 cores (12 Threads)\r\nASRock steel legend B450 moederbord\r\n16gb ram Corsair 3000 Mhz\r\nGTX 1060 6gb\r\n250 gb SSD m .2 ( nieuw ) met Windows 10 pro op.\r\n1TB HDD voor je games ( Warzone + Overwatch geïnstalleerd om te testen )\r\n550 Watt voeding xilence\r\nCorsair case ( met andere (nieuwe) fans erin.) Case had geen fans\r\nFans en GPU zijn ook wit zodat alles past\r\nStofvrij + nieuwe koelpasta\r\nDrivers geüpdatet\r\n\r\nLiefst ophalen ( verzenden mogelijk op kosten en risico van de klant ).",
            price: 500,
            category: {
                id: 2,
                name: "Desktop PCs",
                blobName: "cat-desktop-pcs.webp",
                imageUrl: `${azureBaseUrl}/${container}/cat-desktop-pcs.webp`
            },
            deliveryType: {
                id: 3,
                name: "Pick up or ship"
            },
            user: {
                id: 1,
                username: config.get("auth.testUser.username"),
                auth0id: config.get("auth.testUser.userId"),
            },
            city: "Antwerpen",
            images: [{
                    id: 1,
                    url: `${azureBaseUrl}/${container}/2022-11-25T101507.045Zdesktoppc-1.jpg`,
                    blobName: "2022-11-25T101507.045Zdesktoppc-1.jpg"
                },
                {
                    id: 2,
                    url: `${azureBaseUrl}/${container}/2022-11-25T101507.046Zdesktoppc-2.jpg`,
                    blobName: "2022-11-25T101507.046Zdesktoppc-2.jpg"
                },
                {
                    id: 3,
                    url: `${azureBaseUrl}/${container}/2022-11-25T101507.048Zdesktoppc-3.jpg`,
                    blobName: "2022-11-25T101507.048Zdesktoppc-3.jpg"
                },
                {
                    id: 4,
                    url: `${azureBaseUrl}/${container}/2022-11-25T101507.049Zdesktoppc-4.jpg`,
                    blobName: "2022-11-25T101507.049Zdesktoppc-4.jpg"
                }
            ]
        },
        {
            id: 2,
            date: "2022-10-25T10:50:29.786Z",
            title: "Zalman S4 - ATX - Micro ATX - Mini ITX - Behuizing",
            description: "De Zalman S4 computer behuizing is een Midi tower behuizing geschikt voor ATX, Micro-ATX en Mini-ITX moederborden. \r\nDe computer behuizing is voorzien van een transparant window.\r\n \r\nForm Factor Moederbord: ATX, Micro-ATX (uATX), Mini-ITX\r\n \r\nTechnische Specificaties:\r\n  Behuizingtype: Midi Tower\r\n  Form Factor: ATX, Micro-ATX (µATX), Mini-ITX\r\n \r\nAfmetingen:\r\n  Hoogte: 458mm\r\n  Breedte: 206mm\r\n  Diepte: 380mm\r\n ",
            price: 44.95,
            category: {
                id: 3,
                name: "Computer Cases",
                blobName: "cat-computer-cases.webp",
                imageUrl: `${azureBaseUrl}/${container}/cat-computer-cases.webp`
            },
            deliveryType: {
                id: 2,
                name: "Ship"
            },
            user: {
                id: 1,
                username: config.get("auth.testUser.username"),
                auth0id: config.get("auth.testUser.userId"),
            },
            city: "Oostende",
            images: []
        },
        {
            id: 3,
            date: "2022-11-25T10:00:33.675Z",
            title: "Rtx 2060 GDDR6 12GB Topstaat als nieuw",
            description: "Bij deze bied ik deze rtx 2060 12GB videokaart aan in zeer goede staat moet niet weg wordt nog gebruikt .\r\nZit nu amper paar maandjes in mijn pc maar ik wil overschakelen naar een andere...\r\nDeze is 12GB en de meeste 2060 die je vind zijn maar 6 of 8GB kan alle recente games aan met goede fps (mw2/wz2) \r\nKan getest worden \r\nmvg",
            price: 249.5,
            category: {
                id: 1,
                name: "Graphics Cards",
                blobName: "cat-graphics-cards.webp",
                imageUrl: `${azureBaseUrl}/${container}/cat-graphics-cards.webp`
            },
            deliveryType: {
                id: 1,
                name: "Pick up"
            },
            user: {
                id: 2,
                username: config.get("auth.testUserAdmin.username"),
                auth0id: config.get("auth.testUserAdmin.userId"),
            },
            city: "Melle",
            images: [{
                    id: 5,
                    url: `${azureBaseUrl}/${container}/2022-11-25T100033.624Zrtx2060-3.jpg`,
                    blobName: "2022-11-25T100033.624Zrtx2060-3.jpg"
                },
                {
                    id: 6,
                    url: `${azureBaseUrl}/${container}/2022-11-25T100033.626Zrtx2060-2.jpg`,
                    blobName: "2022-11-25T100033.626Zrtx2060-2.jpg"
                },
                {
                    id: 7,
                    url: `${azureBaseUrl}/${container}/2022-11-25T100033.627Zrtx2060-1.jpg`,
                    blobName: "2022-11-25T100033.627Zrtx2060-1.jpg"
                }
            ]
        }
    ],
    categories: [{
            id: 1,
            name: "Graphics Cards",
            blobName: "cat-graphics-cards.webp",
            imageUrl: `${azureBaseUrl}/${container}/cat-graphics-cards.webp`
        },
        {
            id: 2,
            name: "Desktop PCs",
            blobName: "cat-desktop-pcs.webp",
            imageUrl: `${azureBaseUrl}/${container}/cat-desktop-pcs.webp`
        },
        {
            id: 3,
            name: "Computer Cases",
            blobName: "cat-computer-cases.webp",
            imageUrl: `${azureBaseUrl}/${container}/cat-computer-cases.webp`
        },
    ],
    deliveryTypes: [{
            id: 1,
            name: "Pick up"
        },
        {
            id: 2,
            name: "Ship"
        },
        {
            id: 3,
            name: "Pick up or ship"
        },
    ],
    users: [{
            id: 1,
            username: config.get("auth.testUser.username"),
            auth0id: config.get("auth.testUser.userId"),
        },
        {
            id: 2,
            username: config.get("auth.testUserAdmin.username"),
            auth0id: config.get("auth.testUserAdmin.userId"),
        }
    ],
    favorites: [{
            userId: 1,
            postId: 1
        },
        {
            userId: 2,
            postId: 3
        },
    ]
}

const VALID_TITLE = "a valid title that has less than 50 characters";
const VALID_CATEGORY_ID = 1;
const VALID_DELIVERYTYPE_ID = 2;
const VALID_DESCRIPTION = "a valid description that has less than 5000 characters";
const VALID_CITY = "a valid city that has less than 50 characters";
const VALID_IMAGES_NAMES = ["image0.jfif", "image1.jfif", "image2.jfif", "image3.jfif", "image4.jfif", "image5.jfif"];
const VALID_PRICE = 1345.67;

const url = "/api/posts";

//Omvormen van data.posts naar verwachte response in lijst
const toItemsInListResponse = (items, userIdFavorite) => {
    return items.map((post) => {
        const postInGetById = toItemInGetById(post, userIdFavorite);
        //Maar 1 image in lijst
        const image = postInGetById.images[0] || null;
        const {
            images: _,
            ...rest
        } = postInGetById;
        return {
            ...rest,
            image: image
        };
    });
}

//Omvormen van data.posts naar verwachte response in getById
const toItemInGetById = (post, userIdFavorite) => {
    const favoritePostIds = userIdFavorite && data.favorites.filter(({
        userId
    }) => userId === userIdFavorite).map(({
        postId
    }) => postId);
    //Favorite status toevoegen en geen auth0id bij user
    return {
        ...post,
        user: {
            id: post.user.id,
            username: post.user.username
        },
        favorite: favoritePostIds ? favoritePostIds.includes(post.id) : false
    };
}

describe("Posts", () => {
    let request;
    let prisma;
    let authHeaderUser;
    let authHeaderAdmin;

    withServer(({
        prisma: p,
        request: r,
        authHeaderUser: a,
        authHeaderAdmin: aa
    }) => {
        prisma = p;
        request = r;
        authHeaderUser = a;
        authHeaderAdmin = aa;
    });

    const fillTestImageContainer = async () => {
        const containerClient = getImageContainerClient();
        const testDataBlobNames = data.posts.map(({
            images
        }) => images).flatMap(images => images).map(({
            blobName
        }) => blobName);
        //Images die gebruikt worden in testen uploaden
        fs.readdir("seedImages", async (err, files) => {
            await Promise.all(files.filter((file) => testDataBlobNames.includes(file)).map((file) => {
                const data = fs.readFileSync(`seedImages/${file}`);
                const blockBlobClient = containerClient.getBlockBlobClient(file);
                blockBlobClient.upload(data, data.length);
            }));
        });
    }

    const resetTestImageContainer = async () => {
        const containerClient = getImageContainerClient();
        // testimages container
        for await (const blob of containerClient.listBlobsFlat()) {
            await containerClient.getBlockBlobClient(blob.name).delete();
        }
    }


    const fillDb = async ({
        includeFavorites
    } = {}) => {
        await prisma.user.createMany({
            data: data.users
        });
        await prisma.category.createMany({
            data: data.categories
        });
        await prisma.deliveryType.createMany({
            data: data.deliveryTypes
        })
        await Promise.all(data.posts.map((post) => prisma.post.create({
            data: {
                id: post.id,
                title: post.title,
                description: post.description,
                price: post.price,
                city: post.city,
                date: post.date,
                categoryId: post.category.id,
                deliveryTypeId: post.deliveryType.id,
                userId: post.user.id,
                images: {
                    createMany: {
                        data: post.images
                    }
                },

            }
        })));
        if (includeFavorites) {
            await prisma.favorite.createMany({
                data: data.favorites
            });
        }

    }


    const resetDb = async () => {
        await prisma.user.deleteMany({});
        await prisma.post.deleteMany({});
        await prisma.category.deleteMany({});
        await prisma.deliveryType.deleteMany({});
        //favorites worden automatisch verwijderd bij verwijderen user
    }


    describe("Not logged in (no token)", () => {
        describe("GET /api/posts", () => {
            beforeAll(async () => {
                await fillDb({
                    includeFavorites: true
                });
            });

            afterAll(async () => {
                await resetDb();
            });

            test("it should 200 and return all posts", async () => {
                const response = await request.get(url);
                expect(response.status).toBe(200);
                expect(response.body.count).toBe(3);
                expect(response.body.items.length).toBe(3);
                expect(response.body.items).toEqual(toItemsInListResponse(data.posts));
                expect(response.body.hasNext).toBe(false);
                expect(response.body.total_posts).toBe(3);
            });
        });

        describe("GET /api/posts/:id", () => {
            beforeAll(async () => {
                await fillDb();
            });

            afterAll(async () => {
                await resetDb();
            });

            test("it should 200 and return the requested post", async () => {
                const response = await request.get(`${url}/${data.posts[1].id}`);
                expect(response.status).toBe(200);
                expect(response.body).toEqual(toItemInGetById(data.posts[1]));
            });
        });

        describe("POST /api/posts", () => {
            test("it should 401 and return the error", async () => {
                const response = await request.post(`${url}`);

                expect(response.status).toBe(401);
                expect(response.body.code).toEqual("UNAUTHORIZED");
            });
        });


        describe("PUT /api/posts/:id", () => {
            test("it should 401 and return the error", async () => {
                const response = await request.put(`${url}/${data.posts[0].id}`);

                expect(response.status).toBe(401);
                expect(response.body.code).toEqual("UNAUTHORIZED");
            });
        });

        describe("DELETE /api/posts/:id", () => {
            test("it should 401 and return the error", async () => {
                const response = await request.delete(`${url}/${data.posts[0].id}`);

                expect(response.status).toBe(401);
                expect(response.body.code).toEqual("UNAUTHORIZED");
            });
        });

    });


    describe("Logged in USER", () => {
        describe("GET /api/posts", () => {
            beforeAll(async () => {
                await fillDb({
                    includeFavorites: true
                });
            });

            afterAll(async () => {
                await resetDb();
            });

            test("it should 200 and return all posts", async () => {
                const response = await request.get(url)
                    .set("Authorization", authHeaderUser);
                expect(response.status).toBe(200);
                expect(response.body.count).toBe(3);
                expect(response.body.items.length).toBe(3);

                expect(response.body.items).toEqual(toItemsInListResponse(data.posts, 1));
                expect(response.body.hasNext).toBe(false);
                expect(response.body.total_posts).toBe(3);
            });

            test.each([{
                    limit: 1,
                    offset: 0,
                    items: 1
                },
                {
                    limit: 3,
                    offset: 0,
                    items: 3
                },
                {
                    limit: 2,
                    offset: 1,
                    items: 2
                },
                {
                    limit: 5,
                    offset: 0,
                    items: 3
                },
                {
                    limit: 2,
                    offset: 2,
                    items: 1
                },
                {
                    limit: 25,
                    offset: 5,
                    items: 0
                }
            ])("it should 200 and return $items post(s) (limit=$limit offset=$offset)", async ({
                limit,
                offset,
                items
            }) => {
                const response = await request.get(`${url}?limit=${limit}&offset=${offset}`)
                    .set("Authorization", authHeaderUser);

                expect(response.status).toBe(200);
                expect(response.body.count).toBe(items);
                expect(response.body.items.length).toBe(items);

                expect(response.body.items).toEqual(toItemsInListResponse(data.posts.slice(offset, offset + limit), 1));
                expect(response.body.hasNext).toBe(3 > limit + offset);
                expect(response.body.total_posts).toBe(3);
            });

            test("it should 200 and return all posts with price >= 30 and <=200", async () => {
                const response = await request.get(`${url}?minPrice=30&maxPrice=200`)
                    .set("Authorization", authHeaderUser);
                expect(response.status).toBe(200);
                expect(response.body.count).toBe(1);
                expect(response.body.items.length).toBe(1);
                expect(response.body.items).toEqual(toItemsInListResponse(data.posts.filter(({
                    price
                }) => price >= 30 && price <= 200), 1));
                expect(response.body.hasNext).toBe(false);
                expect(response.body.total_posts).toBe(1);
            });

            test("it should 200 and return all posts with CategoryId 1", async () => {
                const response = await request.get(`${url}?categoryId=1`)
                    .set("Authorization", authHeaderUser);
                expect(response.status).toBe(200);
                expect(response.body.count).toBe(1);
                expect(response.body.items.length).toBe(1);
                expect(response.body.items).toEqual(toItemsInListResponse(data.posts.filter(({
                    category
                }) => category.id === 1), 1));
                expect(response.body.hasNext).toBe(false);
                expect(response.body.total_posts).toBe(1);
            });

            test("it should 200 and return all posts with DeliveryTypeId 1", async () => {
                const response = await request.get(`${url}?deliveryTypeId=1`)
                    .set("Authorization", authHeaderUser);
                expect(response.status).toBe(200);
                expect(response.body.count).toBe(1);
                expect(response.body.items.length).toBe(1);
                expect(response.body.items).toEqual(toItemsInListResponse(data.posts.filter(({
                    deliveryType
                }) => deliveryType.id === 1), 1));
                expect(response.body.hasNext).toBe(false);
                expect(response.body.total_posts).toBe(1);
            });

            test("it should 200 and return all posts with order price descending", async () => {
                const response = await request.get(`${url}?order=price-desc`)
                    .set("Authorization", authHeaderUser);
                expect(response.status).toBe(200);
                expect(response.body.count).toBe(3);
                expect(response.body.items.length).toBe(3);
                expect(response.body.items).toEqual(toItemsInListResponse([...data.posts].sort((p1, p2) => p2.price - p1.price), 1));
                expect(response.body.hasNext).toBe(false);
                expect(response.body.total_posts).toBe(3);
            });

            test("it should 200 and return all posts with order price ascending", async () => {
                const response = await request.get(`${url}?order=price-asc`)
                    .set("Authorization", authHeaderUser);
                expect(response.status).toBe(200);
                expect(response.body.count).toBe(3);
                expect(response.body.items.length).toBe(3);
                expect(response.body.items).toEqual(toItemsInListResponse([...data.posts].sort((p1, p2) => p1.price - p2.price), 1));
                expect(response.body.hasNext).toBe(false);
                expect(response.body.total_posts).toBe(3);
            });

            test("it should 200 and return all posts with order date descending", async () => {
                const response = await request.get(`${url}?order=date-desc`)
                    .set("Authorization", authHeaderUser);
                expect(response.status).toBe(200);
                expect(response.body.count).toBe(3);
                expect(response.body.items.length).toBe(3);
                expect(response.body.items).toEqual(toItemsInListResponse([...data.posts].sort((p1, p2) => new Date(p2.date) - new Date(p1.date)), 1));
                expect(response.body.hasNext).toBe(false);
                expect(response.body.total_posts).toBe(3);
            });

            test("it should 200 and return all posts with order date ascending", async () => {
                const response = await request.get(`${url}?order=date-asc`)
                    .set("Authorization", authHeaderUser);
                expect(response.status).toBe(200);
                expect(response.body.count).toBe(3);
                expect(response.body.items.length).toBe(3);
                expect(response.body.items).toEqual(toItemsInListResponse([...data.posts].sort((p1, p2) => new Date(p1.date) - new Date(p2.date)), 1));
                expect(response.body.hasNext).toBe(false);
                expect(response.body.total_posts).toBe(3);
            });

            test("it should 200 and return all posts that include searchterm 'ryzen'", async () => {
                const response = await request.get(`${url}?searchterm=ryzen`)
                    .set("Authorization", authHeaderUser);
                expect(response.status).toBe(200);
                expect(response.body.count).toBe(1);
                expect(response.body.items.length).toBe(1);
                expect(response.body.items).toEqual(toItemsInListResponse(data.posts.slice(0, 1), 1));
                expect(response.body.hasNext).toBe(false);
                expect(response.body.total_posts).toBe(1);
            });
        });

        describe("POST /api/posts", () => {
            beforeAll(async () => {
                await fillDb();
                await fillTestImageContainer();
            });

            afterAll(async () => {
                await resetDb();
                await resetTestImageContainer();
            });

            test("it should 201 and return the created post", async () => {
                const response = await request.post(url)
                    .set("Authorization", authHeaderUser)
                    .set("Content-Type", "multipart/form-data")
                    .field("title", VALID_TITLE)
                    .field("categoryId", VALID_CATEGORY_ID)
                    .field("deliveryTypeId", VALID_DELIVERYTYPE_ID)
                    .field("description", VALID_DESCRIPTION)
                    .field("city", VALID_CITY)
                    .field("price", VALID_PRICE)
                    .attach("image", path.resolve(__dirname, `../testimages/${VALID_IMAGES_NAMES[0]}`), {
                        contentType: "image/jpeg"
                    })
                    .attach("image", path.resolve(__dirname, `../testimages/${VALID_IMAGES_NAMES[1]}`), {
                        contentType: "image/jpeg"
                    })
                    .attach("image", path.resolve(__dirname, `../testimages/${VALID_IMAGES_NAMES[2]}`), {
                        contentType: "image/jpeg"
                    })
                    .attach("image", path.resolve(__dirname, `../testimages/${VALID_IMAGES_NAMES[3]}`), {
                        contentType: "image/jpeg"
                    })
                    .attach("image", path.resolve(__dirname, `../testimages/${VALID_IMAGES_NAMES[4]}`), {
                        contentType: "image/jpeg"
                    });

                expect(response.status).toBe(201);
                expect(response.body.id).toBeTruthy();
                expect(response.body.title).toBe(VALID_TITLE);
                expect(response.body.description).toBe(VALID_DESCRIPTION);
                expect(response.body.price).toBe(VALID_PRICE);
                expect(response.body.category).toEqual(data.categories[0]);
                expect(response.body.deliveryType).toEqual(data.deliveryTypes[1]);
                expect(response.body.user.id).toEqual(data.users[0].id);
                expect(response.body.user.name).toEqual(data.users[0].name);
                expect(response.body.city).toBe(VALID_CITY);

                response.body.images.forEach((image, i) => {
                    expect(image.url).toContain(VALID_IMAGES_NAMES[i]);
                    expect(image.url).toContain(`${azureBaseUrl}/${container}/`);
                });

            });

            test("it should 400 and return the validationError (image mimetype not allowed)", async () => {
                const response = await request.post(url)
                    .set("Authorization", authHeaderUser)
                    .set("Content-Type", "multipart/form-data")
                    .field("title", VALID_TITLE)
                    .field("categoryId", VALID_CATEGORY_ID)
                    .field("deliveryTypeId", VALID_DELIVERYTYPE_ID)
                    .field("description", VALID_DESCRIPTION)
                    .field("city", VALID_CITY)
                    .field("price", VALID_PRICE)
                    .attach("image", path.resolve(__dirname, `../testimages/${VALID_IMAGES_NAMES[0]}`), {
                        contentType: "image/jpeg"
                    })
                    .attach("image", path.resolve(__dirname, `../testimages/${VALID_IMAGES_NAMES[1]}`), {
                        contentType: "image/jpeg"
                    })
                    .attach("image", path.resolve(__dirname, `../testimages/${VALID_IMAGES_NAMES[2]}`), {
                        contentType: "image/jpeg"
                    })
                    .attach("image", path.resolve(__dirname, `../testimages/${VALID_IMAGES_NAMES[3]}`), {
                        contentType: "image/jpeg"
                    })
                    .attach("image", path.resolve(__dirname, `../testimages/invalid_type_image.webp`), {
                        contentType: "image/webp"
                    });

                expect(response.status).toBe(400);
                expect(response.body.code).toBe("LIMIT_FILE_MIMETYPE");
            });

            test("it should 400 and return the validationError (too many images provided (> 5))", async () => {
                const response = await request.post(url)
                    .set("Authorization", authHeaderUser)
                    .set("Content-Type", "multipart/form-data")
                    .field("title", VALID_TITLE)
                    .field("categoryId", VALID_CATEGORY_ID)
                    .field("deliveryTypeId", VALID_DELIVERYTYPE_ID)
                    .field("description", VALID_DESCRIPTION)
                    .field("city", VALID_CITY)
                    .field("price", VALID_PRICE)
                    .attach("image", path.resolve(__dirname, `../testimages/${VALID_IMAGES_NAMES[0]}`), {
                        contentType: "image/jpeg"
                    })
                    .attach("image", path.resolve(__dirname, `../testimages/${VALID_IMAGES_NAMES[1]}`), {
                        contentType: "image/jpeg"
                    })
                    .attach("image", path.resolve(__dirname, `../testimages/${VALID_IMAGES_NAMES[2]}`), {
                        contentType: "image/jpeg"
                    })
                    .attach("image", path.resolve(__dirname, `../testimages/${VALID_IMAGES_NAMES[3]}`), {
                        contentType: "image/jpeg"
                    })
                    .attach("image", path.resolve(__dirname, `../testimages/${VALID_IMAGES_NAMES[4]}`), {
                        contentType: "image/jpeg"
                    })
                    .attach("image", path.resolve(__dirname, `../testimages/${VALID_IMAGES_NAMES[5]}`), {
                        contentType: "image/jpeg"
                    });

                expect(response.status).toBe(400);
                expect(response.body.code).toBe("LIMIT_UNEXPECTED_FILE");
            });

            test("it should 400 and return the validationError (image filesize too large)", async () => {
                const response = await request.post(url)
                    .set("Authorization", authHeaderUser)
                    .set("Content-Type", "multipart/form-data")
                    .field("title", VALID_TITLE)
                    .field("categoryId", VALID_CATEGORY_ID)
                    .field("deliveryTypeId", VALID_DELIVERYTYPE_ID)
                    .field("description", VALID_DESCRIPTION)
                    .field("city", VALID_CITY)
                    .field("price", VALID_PRICE)
                    .attach("image", path.resolve(__dirname, `../testimages/invalid_filesize_too_large.jpg`), {
                        contentType: "image/jpeg"
                    });

                expect(response.status).toBe(400);
                expect(response.body.code).toBe("LIMIT_FILE_SIZE");
            });

            test.each([{
                invalidTitle: "",
                check: "too short"
            }, {
                invalidTitle: "a",
                check: "too short"
            }, {
                invalidTitle: "a".repeat(51),
                check: "too long"
            }])("it should 400 and return the validationError (invalid title '$invalidTitle' is $check)", async ({
                invalidTitle
            }) => {
                const response = await request.post(url)
                    .set("Authorization", authHeaderUser)
                    .set("Content-Type", "multipart/form-data")
                    .field("title", invalidTitle)
                    .field("categoryId", VALID_CATEGORY_ID)
                    .field("deliveryTypeId", VALID_DELIVERYTYPE_ID)
                    .field("description", VALID_DESCRIPTION)
                    .field("city", VALID_CITY)
                    .field("price", VALID_PRICE);

                expect(response.status).toBe(400);
                expect(response.body.code).toBe("VALIDATION_FAILED");
                expect(response.body.details.body).toHaveProperty("title");
            });

            test.each([{
                invalidPrice: -1,
                check: "< 0"
            }, {
                invalidPrice: 100001,
                check: "> 100 000"
            }, {
                invalidPrice: "a",
                check: "is not a number"
            }])("it should 400 and return the validationError (invalid price $invalidPrice $check)", async ({
                invalidPrice
            }) => {
                const response = await request.post(url)
                    .set("Authorization", authHeaderUser)
                    .set("Content-Type", "multipart/form-data")
                    .field("title", VALID_TITLE)
                    .field("categoryId", VALID_CATEGORY_ID)
                    .field("deliveryTypeId", VALID_DELIVERYTYPE_ID)
                    .field("description", VALID_DESCRIPTION)
                    .field("city", VALID_CITY)
                    .field("price", invalidPrice);

                expect(response.status).toBe(400);
                expect(response.body.code).toBe("VALIDATION_FAILED");
                expect(response.body.details.body).toHaveProperty("price");
            });

            test("it should 400 and return the validationError (invalid description > 5000 characters))", async () => {
                const response = await request.post(url)
                    .set("Authorization", authHeaderUser)
                    .set("Content-Type", "multipart/form-data")
                    .field("title", VALID_TITLE)
                    .field("categoryId", VALID_CATEGORY_ID)
                    .field("deliveryTypeId", VALID_DELIVERYTYPE_ID)
                    .field("description", "a".repeat(5001))
                    .field("city", VALID_CITY)
                    .field("price", VALID_PRICE);

                expect(response.status).toBe(400);
                expect(response.body.code).toBe("VALIDATION_FAILED");
                expect(response.body.details.body).toHaveProperty("description");
            });

            test("it should 400 and return the validationError (deliveryType with Id does not exist)", async () => {
                const response = await request.post(url)
                    .set("Authorization", authHeaderUser)
                    .set("Content-Type", "multipart/form-data")
                    .field("title", VALID_TITLE)
                    .field("categoryId", VALID_CATEGORY_ID)
                    .field("deliveryTypeId", 5)
                    .field("description", VALID_DESCRIPTION)
                    .field("city", VALID_CITY)
                    .field("price", VALID_PRICE);
                expect(response.status).toBe(400);
                expect(response.body.code).toBe("VALIDATION_FAILED");
                expect(response.body.details.body).toHaveProperty("deliveryTypeId");
            });

            test("it should 400 and return the validationError (category with Id does not exist)", async () => {
                const response = await request.post(url)
                    .set("Authorization", authHeaderUser)
                    .set("Content-Type", "multipart/form-data")
                    .field("title", VALID_TITLE)
                    .field("categoryId", 12313)
                    .field("deliveryTypeId", VALID_DELIVERYTYPE_ID)
                    .field("description", VALID_DESCRIPTION)
                    .field("city", VALID_CITY)
                    .field("price", VALID_PRICE);
                expect(response.status).toBe(400);
                expect(response.body.code).toBe("VALIDATION_FAILED");
                expect(response.body.details.body).toHaveProperty("categoryId");
            });

            //https://github.com/sms-system/conditional-chain
            const cond = (chain) => {
                return {
                    if (condition, thanF, elseF) {
                        return cond(condition ? thanF(chain) : (
                            elseF ? elseF(chain) : chain
                        ))
                    },
                    chain(f) {
                        return cond(f(chain))
                    },
                    end() {
                        return chain
                    }
                }
            }

            test.each(["title", "description", "categoryId", "deliveryTypeId", "city", "price"])
                ("it should 400 and return the validationError (%s not provided)", async (missingKey) => {
                    const response = await cond(request.post(url)
                            .set("Authorization", authHeaderUser)
                            .set("Content-Type", "multipart/form-data"))
                        .if(missingKey !== "title", req => req.field("title", VALID_TITLE))
                        .if(missingKey !== "categoryId", req => req.field("categoryId", VALID_CATEGORY_ID))
                        .if(missingKey !== "deliveryTypeId", req => req.field("deliveryTypeId", VALID_DELIVERYTYPE_ID))
                        .if(missingKey !== "description", req => req.field("description", VALID_DESCRIPTION))
                        .if(missingKey !== "city", req => req.field("city", VALID_CITY))
                        .if(missingKey !== "price", req => req.field("price", VALID_PRICE)).end();

                    expect(response.status).toBe(400);
                    expect(response.body.code).toBe("VALIDATION_FAILED");
                    expect(response.body.details.body).toHaveProperty(missingKey);
                });


        });

        describe("PUT /api/posts/:id", () => {
            const updatedTitle = "a new title";
            const updatedCategoryId = 2;
            const updatedDeliveryTypeId = 1;
            const updatedDescription = "a new description";
            const updatedCity = "a new city";
            const updatedPrice = 52.67;

            beforeAll(async () => {
                await fillDb();
                await fillTestImageContainer();
            });

            afterAll(async () => {
                await resetDb();
                await resetTestImageContainer();
            });

            test("it should 200 and return the updated post", async () => {
                const newImagesNames = ["image4.jfif", "image5.jfif"];

                const retainedImages = data.posts[0].images.slice(0, 2);

                const response = await request.put(`${url}/1`)
                    .set("Authorization", authHeaderUser)
                    .set("Content-Type", "multipart/form-data")
                    .field("title", updatedTitle)
                    .field("categoryId", updatedCategoryId)
                    .field("deliveryTypeId", updatedDeliveryTypeId)
                    .field("description", updatedDescription)
                    .field("city", updatedCity)
                    .field("price", updatedPrice)
                    .field("images", JSON.stringify(retainedImages))
                    .attach("image", path.resolve(__dirname, `../testimages/${newImagesNames[0]}`), {
                        contentType: "image/jpeg"
                    })
                    .attach("image", path.resolve(__dirname, `../testimages/${newImagesNames[1]}`), {
                        contentType: "image/jpeg"
                    });

                expect(response.status).toBe(200);
                expect(response.body.id).toBeTruthy();
                expect(response.body.title).toBe(updatedTitle);
                expect(response.body.description).toBe(updatedDescription);
                expect(response.body.price).toBe(updatedPrice);
                expect(response.body.category).toEqual(data.categories[1]);
                expect(response.body.deliveryType).toEqual(data.deliveryTypes[0]);
                expect(response.body.user.id).toEqual(data.users[0].id);
                expect(response.body.user.name).toEqual(data.users[0].name);
                expect(response.body.city).toBe(updatedCity);

                // 2 images blijven behouden bij wijziging, 2 nieuwe images zijn toegevoegd
                expect(response.body.images.slice(0, 2)).toEqual(retainedImages);
                response.body.images.slice(2).forEach((image, i) => {
                    expect(image.url).toContain(newImagesNames[i]);
                    expect(image.url).toContain(`${azureBaseUrl}/${container}/`);
                });
            });

            test("it should 400 and return the validationError (too many images)", async () => {
                // 4 nieuwe images
                const newImagesNames = ["image1.jfif", "image2.jfif", "image3.jfif", "image4.jfif"];

                //2 images blijven behouden 
                const retainedImages = data.posts[0].images.slice(0, 2);

                const response = await request.put(`${url}/1`)
                    .set("Authorization", authHeaderUser)
                    .set("Content-Type", "multipart/form-data")
                    .field("title", updatedTitle)
                    .field("categoryId", updatedCategoryId)
                    .field("deliveryTypeId", updatedDeliveryTypeId)
                    .field("description", updatedDescription)
                    .field("city", updatedCity)
                    .field("price", updatedPrice)
                    .field("images", JSON.stringify(retainedImages))
                    .attach("image", path.resolve(__dirname, `../testimages/${newImagesNames[0]}`), {
                        contentType: "image/jpeg"
                    })
                    .attach("image", path.resolve(__dirname, `../testimages/${newImagesNames[1]}`), {
                        contentType: "image/jpeg"
                    })
                    .attach("image", path.resolve(__dirname, `../testimages/${newImagesNames[2]}`), {
                        contentType: "image/jpeg"
                    })
                    .attach("image", path.resolve(__dirname, `../testimages/${newImagesNames[3]}`), {
                        contentType: "image/jpeg"
                    });

                expect(response.status).toBe(400);
                expect(response.body.code).toBe("VALIDATION_FAILED");
                expect(response.body.details.body).toHaveProperty("images");
            });

            test("it should 403 and return the error (user is not postOwner)", async () => {
                // user with id 1 is not the owner of post with id 3
                const newImagesNames = ["image4.jfif", "image5.jfif"];
                const retainedImages = data.posts[2].images.slice(0, 2);

                const response = await request.put(`${url}/3`)
                    .set("Authorization", authHeaderUser)
                    .set("Content-Type", "multipart/form-data")
                    .field("title", updatedTitle)
                    .field("categoryId", updatedCategoryId)
                    .field("deliveryTypeId", updatedDeliveryTypeId)
                    .field("description", updatedDescription)
                    .field("city", updatedCity)
                    .field("price", updatedPrice)
                    .field("images", JSON.stringify(retainedImages))
                    .attach("image", path.resolve(__dirname, `../testimages/${newImagesNames[0]}`), {
                        contentType: "image/jpeg"
                    })
                    .attach("image", path.resolve(__dirname, `../testimages/${newImagesNames[1]}`), {
                        contentType: "image/jpeg"
                    })

                expect(response.status).toBe(403);
                expect(response.body.code).toEqual("FORBIDDEN");
            });

            test("it should 404 and return the error (postId does not exist)", async () => {
                const retainedImages = data.posts[2].images.slice(0, 2);

                const response = await request.put(`${url}/45646`)
                    .set("Authorization", authHeaderUser)
                    .set("Content-Type", "multipart/form-data")
                    .field("title", updatedTitle)
                    .field("categoryId", updatedCategoryId)
                    .field("deliveryTypeId", updatedDeliveryTypeId)
                    .field("description", updatedDescription)
                    .field("city", updatedCity)
                    .field("price", updatedPrice)
                    .field("images", JSON.stringify(retainedImages));

                expect(response.status).toBe(404);
                expect(response.body.code).toEqual("NOT_FOUND");
            });
        });

        describe("DELETE /api/posts/:id", () => {
            beforeAll(async () => {
                await fillDb();
            });

            afterAll(async () => {
                await resetDb();
            });

            test("it should 204 and return nothing", async () => {
                const response = await request.delete(`${url}/1`)
                    .set("Authorization", authHeaderUser);
                expect(response.status).toBe(204);
                expect(response.body).toEqual({});
            });

            test("it should 403 and return the error (user is not postOwner)", async () => {
                // user with id 1 is not the owner of post with id 3
                const response = await request.delete(`${url}/3`)
                    .set("Authorization", authHeaderUser);
                expect(response.status).toBe(403);
                expect(response.body.code).toEqual("FORBIDDEN");
            });

            test("it should 404 and return the error (postId does not exist)", async () => {
                const response = await request.delete(`${url}/5464`)
                    .set("Authorization", authHeaderUser);
                expect(response.status).toBe(404);
                expect(response.body.code).toEqual("NOT_FOUND");
            });

        });

    });



    describe("Logged in ADMIN", () => {
        describe("PUT /api/posts/:id", () => {
            const updatedTitle = "a new title";
            const updatedCategoryId = 2;
            const updatedDeliveryTypeId = 1;
            const updatedDescription = "a new description";
            const updatedCity = "a new city";
            const updatedPrice = 52.67;

            beforeAll(async () => {
                await fillDb();
                await fillTestImageContainer();
            });

            afterAll(async () => {
                await resetDb();
                await resetTestImageContainer();
            });

            test("it should 200 and return the updated post (admin can change other user's posts)", async () => {
                const newImagesNames = ["image4.jfif", "image5.jfif"];

                const retainedImages = data.posts[0].images.slice(0, 2);

                const response = await request.put(`${url}/1`)
                    .set("Authorization", authHeaderAdmin)
                    .set("Content-Type", "multipart/form-data")
                    .field("title", updatedTitle)
                    .field("categoryId", updatedCategoryId)
                    .field("deliveryTypeId", updatedDeliveryTypeId)
                    .field("description", updatedDescription)
                    .field("city", updatedCity)
                    .field("price", updatedPrice)
                    .field("images", JSON.stringify(retainedImages))
                    .attach("image", path.resolve(__dirname, `../testimages/${newImagesNames[0]}`), {
                        contentType: "image/jpeg"
                    })
                    .attach("image", path.resolve(__dirname, `../testimages/${newImagesNames[1]}`), {
                        contentType: "image/jpeg"
                    });

                expect(response.status).toBe(200);
                expect(response.body.id).toBeTruthy();
                expect(response.body.title).toBe(updatedTitle);
                expect(response.body.description).toBe(updatedDescription);
                expect(response.body.price).toBe(updatedPrice);
                expect(response.body.category).toEqual(data.categories[1]);
                expect(response.body.deliveryType).toEqual(data.deliveryTypes[0]);
                expect(response.body.user.id).toEqual(data.users[0].id);
                expect(response.body.user.name).toEqual(data.users[0].name);
                expect(response.body.city).toBe(updatedCity);

                // 2 images blijven behouden bij wijziging, 2 nieuwe images zijn toegevoegd
                expect(response.body.images.slice(0, 2)).toEqual(retainedImages);
                response.body.images.slice(2).forEach((image, i) => {
                    expect(image.url).toContain(newImagesNames[i]);
                    expect(image.url).toContain(`${azureBaseUrl}/${container}/`);
                });
            });
        });

        describe("DELETE /api/posts/:id", () => {
            beforeAll(async () => {
                await fillDb();
            });

            afterAll(async () => {
                await resetDb();
            });

            test("it should 204 and return nothing (admin can delete other user's posts)", async () => {
                const response = await request.delete(`${url}/1`)
                    .set("Authorization", authHeaderAdmin);
                expect(response.status).toBe(204);
                expect(response.body).toEqual({});
            });
        });

    });

});