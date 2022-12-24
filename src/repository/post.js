const { getPrisma} = require('../data');
const { POST_SELECT } = require('./querySelects');
const { deleteBlobs } = require('../core/image');
const { getLogger } = require('../core/logging');

/**
 * Find the post with the given `id`.
 *
 * @param {number} id - Id of the post to find.
 * @param {number} userId - Id of the user, used for showing favorite status
 */
const findById = async(id, userId) => {
    const post= await getPrisma().post.findUnique({
        where: {
            id: id
        },
        select : POST_SELECT
    });
    const userFavoriteIds = userId ? await getUserFavoriteIds(userId) : [];
    return post && formatPost(userFavoriteIds, post);
}

/**
 * Create a new post with the given `title`, `description`, `price`, `categoryId`, `deliveryTypeId`,`city`, `userId` and `images`.
 *
 * @param {object} post - Post to create.
 * @param {string} post.title - Title of the post.
 * @param {string} post.description- Description of the post.
 * @param {number} post.price - Price of the product listed in the post.
 * @param {number} post.categoryId - Category id of the post.
 * @param {number} post.deliveryTypeId - DeliveryType id of the post.
 * @param {string} post.city - City where to product in the post is being sold from.
 * @param {object[{url: string, blobName: string}]} post.images[] - Images added to the post.
 *
 * @returns {Promise<number>} Created post id
 */
const create = async({title, description, price, categoryId, deliveryTypeId,city, userId, images}) => {
    try {
        const newPost = await getPrisma().post.create({
            data: {
                title, description, price, categoryId, deliveryTypeId, userId,city,
                images: {
                    createMany: {
                        data: images
                    }
                }
            }
        });
        return newPost.id;
    } catch (error) {
		const logger = getLogger();
		logger.error('Error in create', {error});
        throw error;
    }

}

/**
 * Update an existing post with the given `title`, `description`, `price`, `categoryId`, `deliveryTypeId`,`city` and `images`.
 *
 * @param {number} id - Id of the post to update.
 * @param {object} post - The updated post.
 * @param {string} post.title - Title of the post.
 * @param {string} post.description- Description of the post.
 * @param {number} post.price - Price of the product listed in the post.
 * @param {number} post.categoryId - Category id of the post.
 * @param {number} post.deliveryTypeId - DeliveryType id of the post.
 * @param {string} post.city - City where to product in the post is being sold from.
 * @param {object[{id: number, url: string, blobName: string}]} post.images[] - Images attached to the post (new images do not have an id)
 *
 * @returns {Promise<number>} Updated post id
 */
const updateById = async (id, {title, description, price, categoryId, deliveryTypeId, city,images}) => {

    const imagesToDelete = await getPrisma().image.findMany({
        where: {
            postId: id,
            id: {
                notIn: images.filter((image) => image.id).map(({id}) => id)
            }
        }
    });

    
    try {
        await deleteBlobs(...imagesToDelete.map(({blobName}) => blobName));
    
        //Post updaten
        const updatedPost = await getPrisma().post.update({
            where: {
                id: id
            },
            data: {
                title: title,
                description: description,
                price: price,
                categoryId: categoryId,
                deliveryTypeId: deliveryTypeId,
                city: city,
                images: {
                    deleteMany: {
                        id: {
                            in: imagesToDelete.map(({id}) => id)
                        }
                    },
                    createMany: {
                        data: images.filter((image) => !image.id)
                    }
                }
            }
        });
        return updatedPost.id;
    } catch (error) {
        const logger = getLogger();
		logger.error('Error in update', {error});
        console.log(error);
        throw error;
    }

}

/**
 * Delete the post with the given `id`.
 *
 * @param {number} id - Id of the post to delete.
 *
 * @returns {Promise<boolean>} Whether the category was deleted.
 */
const deleteById = async(id) => {
    //Images die bij Post horen verwijderen uit bestandssysteem
    const imagesToDelete = await getPrisma().image.findMany({
        where: {
            postId: id
        }
    });

    await deleteBlobs(...imagesToDelete.map(({blobName}) => blobName));

    //Post verwijderen
    await getPrisma().post.delete({
        where: {
            id: id
        }
    });
}

/**
 * Get every posts that user has set to favorite.
 *
 * @param {number} userId - Id of the user to list the favorites.
 * 
 * @param {Object} queryParams - Optional query
 * @param {number} [queryParams.limit] - Maximum number of posts to return.
 * @param {number} [queryParams.offset] - Offset used when retrieving posts.
 * 
 *
 * @returns {Promise<{posts: object[], total_posts : number}>} The user's favorite posts and the total number of favorited posts.
 */
const findUserFavorites = async(userId, {limit, offset}) => {
    const where = {
        favorites:{
            some:{
                userId: userId
            }
        }
    };
    return await findAndPaginate(where, {limit, offset}, userId);
}

/**
 * Get posts that the user has placed.
 *
 * @param {number} userId - Id of the user to list the posts.
 * 
 * @param {Object} queryParams - Optional query
 * @param {number} [queryParams.limit] - Maximum number of posts to return.
 * @param {number} [queryParams.offset] - Offset used when retrieving posts.
 * 
 *
 * @returns {Promise<{posts: object[], total_posts : number}>} The user's posts and the total number of posts by that user.
 */
const findAllByUser = async(userId, {limit, offset}) => {
    const where = {userId: userId};
    return await findAndPaginate(where, {limit, offset}, userId);
}


/**
 * Get all posts.
 *
 * @param {Object} queryParams - Optional query
 * @param {string} [queryParams.searchterm] - Searchterm used to filter posts by title and description.
 * @param {number} [queryParams.limit] - Maximum number of posts to return.
 * @param {number} [queryParams.offset] - Offset used when retrieving posts.
 * @param {number} [queryParams.categoryId] - CategoryId used to filter posts.
 * @param {number} [queryParams.deliveryTypeId] - DeliveryTypeId used to filter posts.
 * @param {number} [queryParams.minPrice] - Minimum price used to filter posts.
 * @param {number} [queryParams.maxPrice] - Maximum price used to filter posts.
 * @param {string} [queryParams.order] - Order used for sorting posts options: 'date-asc', 'price-asc', 'price-desc', 'price-asc'
 * @param {number} [userId] - Id of the user, used to show the favorite status of the posts.
 *
 * @returns {Promise<{posts: object[], total_posts : number}>} The user's posts and the total number of posts by that user.
 */
const findAll = async({searchterm, limit, offset, categoryId, deliveryTypeId, minPrice, maxPrice, order}, userId) => {
    //Mogelijke query params
    const where = { 
        AND: [
            {
                OR :  [
                    {title: {
                        contains: searchterm
                    }},
                    {description: {
                        contains: searchterm
                    }},
                ]
            },
            {
                price: {
                    gte: Number(minPrice) || undefined
                }
            },
            {
                price: {
                    lte: Number(maxPrice) >= 0 ? Number(maxPrice) : undefined
                }
            },
            { 
                categoryId: Number(categoryId) || undefined 
            },
            { 
                deliveryTypeId: Number(deliveryTypeId) || undefined 
            }
        ]  
    };
    const orderBy = {};
    orderBy[String(order).split("-")[0]] = String(order).split("-")[1];
    return findAndPaginate(where,{limit, offset,orderBy}, userId);
}


// HULPMETHODEN

/**
 * Get all id's of posts favorited by a user.
 *
 * @param {number} userId - Id of the user, used to show the favorite status of the posts.
 *
 * @returns {Promise<number[]>} The id's of posts favorited by a user.
 */ 
const getUserFavoriteIds = async(userId)=>{
    const favoriteIds = await getPrisma().favorite.findMany({
        where: {
            userId: userId
        },
        select: {
            postId:true
        }
    });
    return favoriteIds.map(({postId}) => postId);
}


/**
 * find and paginate posts with given queryParams
 *
 * @param {Object} where - Filter that contains searchterm, minPrice, maxPrice, categoryId, deliveryTypeId
 * @param {Object} queryParams - Optional query
 * @param {number} [queryParams.limit] - Maximum number of posts to return.
 * @param {number} [queryParams.offset] - Offset used when retrieving posts.
 * @param {object} [queryParams.orderBy] - Order to list the posts.
 * @param {number} [userId] - Id of the user, used to show the favorite status of the posts.
 *
 * @returns {Promise<{posts: object[], total_posts : number}>} The user's posts and the total number of posts after filtering.
 */
const findAndPaginate = async(where, {limit, offset, orderBy}, userId) => {
    //Totaal nodig om te bekijken of er nog pagina's na komen
    const total = await getPrisma().post.count({where});
    //Query builden
    const query = {
        orderBy: orderBy,
        select : POST_SELECT,
        take: limit,
        skip:  offset || undefined,
        where: where
    };
    //Posts ophalen
    let posts = await getPrisma().post.findMany(query);

    //Favorite status toevoegen, default false bij request zonder auth
    const userFavoriteIds = userId ? await getUserFavoriteIds(userId) : [];
    posts = posts.map((post) => formatPostInList(userFavoriteIds, post));
    return { posts, total_posts: total};
}


//In een lijst van posts wordt maar 1 image meegegeven
// + favorite status toevoegen
const formatPostInList = (userFavoriteIds, {images,...post}) => {
    return ({...post, image: images[0] || null, favorite: userFavoriteIds.includes(post.id)});
}
// favorite status toevoegen aan post
const formatPost = (userFavoriteIds, {...post}) => {
    return ({...post, favorite: userFavoriteIds.includes(post.id)});
}

module.exports = {
    findAll, findById, create, updateById, deleteById, findUserFavorites, findAllByUser
}