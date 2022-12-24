const { getLogger } = require('../core/logging');
const ServiceError = require('../core/serviceError');
const POSTS_PER_PAGE = 5;
const postRepository = require('../repository/post');

const debugLog = (message, meta = {}) => {
	if (!this.logger) this.logger = getLogger();
	this.logger.debug(message, meta);
};

/**
 * Get all posts.
 *
 * @param {Object} queryParams - Optional queryParams
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
 */
const getAll = async({searchterm, limit, offset, categoryId, deliveryTypeId, minPrice, maxPrice, order}, userId) => {
    debugLog(`Fetching all posts`);
    
    const {posts, total_posts} = await postRepository.findAll({searchterm, limit, offset, categoryId, deliveryTypeId, minPrice, maxPrice, order}, userId);
    return {items: posts, count: posts.length, total_posts, limit: limit, offset: offset, hasNext: limit && offset !== undefined ? total_posts > limit + offset : false};
};

/**
 * Get the post with the given `id`.
 *
 * @param {number} id - Id of the post to find.
 * @param {number} userId - Id of the user, used for showing favorite status
 */
const getById = async(id, userId) => {
    debugLog(`Fetching post with id ${id}`);
    const post = await postRepository.findById(id, userId);
    if(!post){
		throw ServiceError.notFound(`There is no post with id ${id}`, {id});
	}
    return post;
};

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
 */
const create = async({title, description, price,  userId, categoryId, deliveryTypeId, city, images})=> {
    debugLog(`Creating new post`);

    const id = await postRepository.create({title, description, price, userId, categoryId, deliveryTypeId,city, images});
    return getById(id, userId);
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
 */
const updateById = async(id, {title, description, price, categoryId, deliveryTypeId,userId,city, images})=> {
    debugLog(`Updating post with id ${id}`);

    //Throwt ServiceError.notFound als post niet bestaat
    await getById(id);

    await postRepository.updateById(id,{title, description, price, categoryId, deliveryTypeId,city,images});

    return getById(id, userId)
}

/**
 * Delete the post with the given `id`.
 *
 * @param {number} id - Id of the post to delete.
 *
 */
const deleteById = async(id) => {
    debugLog(`Deleting post with id ${id}`);

    //Throwt ServiceError.notFound als post niet bestaat
    await getById(id);

    await postRepository.deleteById(id);
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
 */
const getAllByUserId = async(userId, {limit, offset})=>{
    debugLog(`Fetching all posts by user with id ${userId}`);
    const {posts, total_posts} = await postRepository.findAllByUser(userId, {limit, offset});
    return {items: posts, count: posts.length, total_posts, limit: limit, offset: offset, hasNext: limit && offset !== undefined ? total_posts > limit + offset : false};
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
 */
const getAllUserFavorites = async(userId, {limit, offset})=>{
    debugLog(`Fetching all favorite posts for user with id ${userId}`);

    const {posts, total_posts} = await postRepository.findUserFavorites(userId, {limit, offset});
    return {items: posts, count: posts.length, total_posts, limit: limit, offset: offset,  hasNext: limit && offset !== undefined ? total_posts > limit + offset : false};
}


/**
 * Check if the post related to the given `postId` is placed by the given `userId`.
 *
 * @param {number} postId - Id of the post to check.
 * @param {number} userId - Id of the user that is trying to access the post.
 * 
 * @throws {ServiceError.forbidden} If user is not the owner of the post.
 * 
 */
const checkPostOwner = async(postId, userId) => {
	const {user: {id : postOwnerId}} = await getById(postId);
    const hasPermission = postOwnerId === userId;
	if (!hasPermission) {
		throw ServiceError.forbidden('You are not allowed to edit or delete this post');
	}
};


module.exports = {
    getAll, getById,create, updateById, deleteById, getAllByUserId, getAllUserFavorites, checkPostOwner
};
  