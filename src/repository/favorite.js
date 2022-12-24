const { getLogger } = require('../core/logging');
const { getPrisma} = require('../data');

/**
 * Create a new favorite with the given `userId` and `postId`.
 *
 * @param {string} userId - Id of the user that is creating the favorite.
 * @param {string} postId - Id of the post the user is adding to favorites.
 *
 * @returns {Promise<number>} Created favorite id
 */
const create = async(userId, postId) => {
	try{
		const favorite = await getPrisma().favorite.upsert({
			where: {
				userId_postId: {
					userId: userId,
					postId: postId
				}
			},
			update: {},
			create: {
				userId: userId,
				postId: postId
			}
		});
		return favorite.id;
	}catch(error){
		const logger = getLogger();
		logger.error('Error in create', {
			error
		});
		throw error;
	}
}

/**
 * Delete a favorite with the given `userId` and `postId`.
 *
 * @param {string} userId - Id of the user that is deleting the favorite.
 * @param {string} postId - Id of the post the user is removing from favorites.
 *
 * @returns {Promise<boolean>} Whether the favorite was deleted.
 */
const deleteByUserIdPostId = async(userId, postId) => {
	try{
		await getPrisma().favorite.delete({
			where: {
				userId_postId: {
					userId: userId,
					postId: postId
				}
			},
		});
		return true;
	} catch(error){
		const logger = getLogger();
		logger.error('Error in deleteById', {
			error
		});
		//P2025 = "An operation failed because it depends on one or more records that were required but not found. {cause}"
		if(error.code !=="P2025")
			throw error;

		return false;
	}
    
}

module.exports = {
    create, deleteByUserIdPostId
}