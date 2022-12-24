const config = require("config");
const { withServer } = require("../helpers");
const container = config.get("azure.imageContainer");
const azureBaseUrl = config.get("azureBaseUrl");
const fs = require("fs");
const { getImageContainerClient } = require("../../src/data/azure");
const path = require("path");

const data = {
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
    }]
}
const VALID_CATEGORY_NAME="New category";

const url = "/api/categories";

describe("Categories", () => {
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

    const fillTestImageContainer = async() => {
        const containerClient = getImageContainerClient();
        const testDataBlobNames = data.categories.map(({blobName}) => blobName);
        //Images die gebruikt worden in testen uploaden
        fs.readdir("seedImages", async (err, files) => {
            await Promise.all(files.filter((file) => testDataBlobNames.includes(file)).map((file) => {
                const data = fs.readFileSync(`seedImages/${file}`);
                const blockBlobClient = containerClient.getBlockBlobClient(file);
                blockBlobClient.upload(data, data.length);
            }));
          });
    }

    const resetTestImageContainer = async() => {
        const containerClient = getImageContainerClient();
        // testimages container
        for await (const blob of containerClient.listBlobsFlat()){
            await containerClient.getBlockBlobClient(blob.name).delete();
        }
    }


    const fillDb = async () => {
        await prisma.user.createMany({
            data: data.users
        });
        await prisma.category.createMany({
            data: data.categories
        });

    }

    const resetDb = async () => {
        await prisma.user.deleteMany({});
        await prisma.category.deleteMany({});
    }


    describe("Not logged in (no token)", () => {
        describe("GET /api/categories", () => {
            beforeAll(async () => {
                await fillDb();
            });

            afterAll(async () => {
                await resetDb();
            });

            test("it should 200 and return all categories", async () => {
                const response = await request.get(url);
                expect(response.status).toBe(200);
                expect(response.body.count).toBe(3);
                expect(response.body.items.length).toBe(3);
                expect(response.body.items).toEqual(data.categories);
            });
        });

        describe("GET /api/categories/:id", () => {

            beforeAll(async () => {
                await fillDb();
            });

            afterAll(async () => {
                await resetDb();
            });

            test("it should 200 and return the category", async () => {
                const response = await request.get(`${url}/2`);

                expect(response.status).toBe(200);
                expect(response.body).toEqual(data.categories[1]);
            });
        });

        describe("PUT /api/categories/:id", (token) => {
            beforeAll(async () => {
                await fillDb();
            });

            afterAll(async () => {
                await resetDb();
            });
            
            test("it should 401 and return the error", async () => {
                const response = await request.put(`${url}/1`)
                .set("Content-Type", "multipart/form-data")
                .field("name", VALID_CATEGORY_NAME);
                
                expect(response.status).toBe(401);
                expect(response.body.code).toEqual("UNAUTHORIZED");  
            });
        });
        describe("POST /api/categories", () => {
            beforeAll(async () => {
                await fillDb();
            });

            afterAll(async () => {
                await resetDb();
            });
            
            test("it should 401 and return the error", async () => {
                const response = await request.post(url)
                .set("Content-Type", "multipart/form-data")
                .field("name", VALID_CATEGORY_NAME);
                
                expect(response.status).toBe(401);
                expect(response.body.code).toEqual("UNAUTHORIZED");  
            });
        });

        describe("DELETE/api/categories/:id", () => {
            beforeAll(async () => {
                await fillDb();
            });

            afterAll(async () => {
                await resetDb();
            });
            
            test("it should 401 and return the error", async () => {
                const response = await request.delete(`${url}/1`)
                .set("Content-Type", "multipart/form-data")
                .field("name", VALID_CATEGORY_NAME);
                
                expect(response.status).toBe(401);
                expect(response.body.code).toEqual("UNAUTHORIZED");  
            });
        });
    });
    
    describe("Logged in USER", () => {
        describe("GET /api/categories", () => {
            beforeAll(async () => {
                await fillDb();
            });

            afterAll(async () => {
                await resetDb();
            });

            test("it should 200 and return all categories", async () => {
                const response = await request.get(url)
                .set("Authorization", authHeaderUser);

                expect(response.status).toBe(200);
                expect(response.body.count).toBe(3);
                expect(response.body.items.length).toBe(3);
                expect(response.body.items).toEqual(data.categories);
            });
        });

        describe("GET /api/categories/:id", () => {

            beforeAll(async () => {
                await fillDb();
            });

            afterAll(async () => {
                await resetDb();
            });

            test("it should 200 and return the category", async () => {
                const response = await request.get(`${url}/1`)
                .set("Authorization", authHeaderUser);

                expect(response.status).toBe(200);
                expect(response.body).toEqual(data.categories[0]);
            });
        });

        describe("PUT /api/categories/:id", (token) => {
            beforeAll(async () => {
                await fillDb();
            });

            afterAll(async () => {
                await resetDb();
            });
            
            test("it should 403 and return the error", async () => {
                const response = await request.put(`${url}/1`)
                .set("Authorization", authHeaderUser)
                .set("Content-Type", "multipart/form-data")
                .field("name", VALID_CATEGORY_NAME);
                
                expect(response.status).toBe(403);
                expect(response.body.code).toEqual("FORBIDDEN");  
            });
        });
        describe("POST /api/categories", () => {
            beforeAll(async () => {
                await fillDb();
            });

            afterAll(async () => {
                await resetDb();
            });
            
            test("it should 403 and return the error", async () => {
                const response = await request.post(url)
                .set("Authorization", authHeaderUser)
                .set("Content-Type", "multipart/form-data")
                .field("name", VALID_CATEGORY_NAME);
                
                expect(response.status).toBe(403);
                expect(response.body.code).toEqual("FORBIDDEN");  
            });
        });

        describe("DELETE/api/categories/:id", () => {
            beforeAll(async () => {
                await fillDb();
            });

            afterAll(async () => {
                await resetDb();
            });
            
            test("it should 403 and return the error", async () => {
                const response = await request.delete(`${url}/1`)
                .set("Authorization", authHeaderUser)
                .set("Content-Type", "multipart/form-data")
                .field("name", VALID_CATEGORY_NAME);
                
                expect(response.status).toBe(403);
                expect(response.body.code).toEqual("FORBIDDEN");  
            });
        });
    });

    describe("Logged in ADMIN", () => {
        describe("POST /api/categories/:id", (token) => {
            beforeAll(async () => {
                await fillDb();
                await fillTestImageContainer();
            });

            afterAll(async () => {
                await resetDb();
                await resetTestImageContainer();
            });
            
            test("it should 201 and return the create category", async () => {
                const response = await request.put(`${url}/1`)
                .set("Authorization", authHeaderAdmin)
                .set("Content-Type", "multipart/form-data")
                .field("name", "new name")
                .attach("image", path.resolve(__dirname, `../testimages/image0.jfif`), {contentType: "image/jpeg"});
                
                expect(response.status).toBe(200);
                expect(response.body.id).toBeTruthy();
                expect(response.body.name).toBe("new name");
                expect(response.body.blobName).toContain("image0.jfif");
                expect(response.body.imageUrl).toContain(`${azureBaseUrl}/${container}/`);
            });
        });

        describe("PUT /api/categories/:id", (token) => {
            beforeAll(async () => {
                await fillDb();
                await fillTestImageContainer();
            });

            afterAll(async () => {
                await resetDb();
                await resetTestImageContainer();
            });
            
            test("it should 200 and return the updated category", async () => {
                const response = await request.put(`${url}/1`)
                .set("Authorization", authHeaderAdmin)
                .set("Content-Type", "multipart/form-data")
                .field("name", VALID_CATEGORY_NAME)
                .attach("image", path.resolve(__dirname, `../testimages/image0.jfif`), {contentType: "image/jpeg"});
                
                expect(response.status).toBe(200);
                expect(response.body.id).toBeTruthy();
                expect(response.body.name).toBe(VALID_CATEGORY_NAME);
                expect(response.body.blobName).toContain("image0.jfif");
                expect(response.body.imageUrl).toContain(`${azureBaseUrl}/${container}/`);
            });
        });
    

        describe("DELETE/api/categories/:id", () => {
            beforeAll(async () => {
                await fillDb();
            });

            afterAll(async () => {
                await resetDb();
            });
            
            test("it should 204 and return nothing", async () => {
                const response = await request.delete(`${url}/2`)
                .set("Authorization", authHeaderAdmin)
                .set("Content-Type", "multipart/form-data")
                .field("name", VALID_CATEGORY_NAME);
                
                expect(response.status).toBe(204);
                expect(response.body).toEqual({});
            });
        });
    });
  


});
