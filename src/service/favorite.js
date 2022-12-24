const { getLogger } = require('../core/logging');
const { getPrisma } = require('../data/index');
const favoriteRepository = require('../repository/favorite');

const debugLog = (message, meta = {}) => {
	if (!this.logger) this.logger = getLogger();
	this.logger.debug(message, meta);
};

/**
 * Create a new favorite with the given `userId` and `postId`.
 *
 * @param {string} userId - Id of the user that is creating the favorite.
 * @param {string} postId - Id of the post the user is adding to favorites.
 *
 */
const createFavorite = async(userId, postId) => {
    debugLog(`Adding postId ${postId} to favorites of userId ${userId}`);
	await favoriteRepository.create(userId, postId);
}

/**
 * Delete a favorite with the given `userId` and `postId`.
 *
 * @param {string} userId - Id of the user that is deleting the favorite.
 * @param {string} postId - Id of the post the user is removing from favorites.
 *
 */
const deleteFavorite = async(userId, postId) => {
    debugLog(`Deleting postId ${postId} from favorites of userId ${userId}`);
	await favoriteRepository.deleteByUserIdPostId(userId, postId);
}

module.exports = {
	createFavorite, deleteFavorite
};
  