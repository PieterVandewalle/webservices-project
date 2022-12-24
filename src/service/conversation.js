const { getLogger } = require('../core/logging');
const ServiceError = require('../core/serviceError');
const conversationRepository = require('../repository/conversation');

const debugLog = (message, meta = {}) => {
	if (!this.logger) this.logger = getLogger();
	this.logger.debug(message, meta);
};

/**
 * Get the conversation with the given `id`.
 *
 * @param {number} id - Id of the conversation to find.
 */
const getById = async(id) => {
    debugLog(`Fetching conversation with id ${id}`);
    const conversation =  await conversationRepository.findById(id);
	if(!conversation){
		throw ServiceError.notFound(`There is no conversation with id ${id}`, {id});
	}
    return conversation;
}

/**
 * Delete the conversation with the given `id`. Soft deletes the conversation if there is still another user in the conversation.
 *
 * @param {number} id - Id of the conversation to delete.
 * @param {number} userId - Id of the user that wants to delete the conversation.
 *
 */
const deleteById = async(id, userId) => {
    debugLog(`Deleting conversation with id ${id} for user ${userId}`);

    const oldConversation = await getById(id);
    //Als conversatie reeds verwijderd is door 1 gebruiker mag hij volledig verwijderd worden
    //Als dit niet het geval is -> soft delete
    const deletedByOne = oldConversation.deletedByPostReplier  || oldConversation.deletedByPostOwner;
    return deletedByOne ? conversationRepository.deleteById(id, userId) : conversationRepository.softDeleteById(id, userId);
}

/**
 * Get all conversations by users with the given `userId`.
 *
 * @param {number} userId - Id of the user to find conversations.
 */
const getAllByUserId = async(userId) => {
    debugLog(`Fetching all conversations for user ${userId}`);
    
    const conversations = await conversationRepository.findAllByUserId(userId);
    return {items: conversations, count: conversations.length};
};

/**
 * Create a new conversation with the given `postId`, `postReplierId`.
 *
 * @param {object} conversation - Conversation to create.
 * @param {number} conversation.postId - The id of the post for which the conversation is created.
 * @param {number} conversation.postReplierId- The id of the user that has created a conversation to reply to a post.
 *
 */
const create = async({postId,postReplierId})=> {
    debugLog(`Creating new conversation`);
    const id = await conversationRepository.create({postId, postReplierId});
    return getById(id);
}

/**
 * Check if the given `userId` is in the conversation with the given `conversationId`.
 *
 * @param {number} conversationId - Id of the conversation to check.
 * @param {number} userId - Id of the user that is trying to access the conversation.
 * 
 * @throws {ServiceError.forbidden} If user is not one of the users in the conversation
 * 
 */
const checkInConversation = async(conversationId, userId) => {
    const conversation = await getById(conversationId);

    const hasPermission = conversation.postOwner.id === userId || conversation.postReplier.id === userId;
	if (!hasPermission) {
		throw ServiceError.forbidden('You are not allowed to edit this conversation');
	}
};

module.exports = {
    getById,create, getAllByUserId,checkInConversation, deleteById, debugLog
};
  