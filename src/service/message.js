const { getLogger } = require('../core/logging');
const messageRepository = require('../repository/message');

const debugLog = (message, meta = {}) => {
	if (!this.logger) this.logger = getLogger();
	this.logger.debug(message, meta);
};

/**
 * Get the message with the given `id`.
 *
 * @param {number} id - Id of the message to find.
 */
const getById = async(id) => {
    const message =  await messageRepository.findById(id);
	if(!message){
		throw ServiceError.notFound(`There is no message with id ${id}`, {id});
	}
    return message;
}

/**
 * Create a new message in the conversation with the given `conversationId`,`content` and `senderId`.
 *
 * @param {object} message - Message to create
 * @param {number} message.conversationId - Id of the conversation in which the message is placed
 * @param {string} message.content - The messate content
 * @param {number} message.senderId - UserId of the message sender.
 *
 */
const create = async({conversationId, senderId, content})=> {
    debugLog(`Creating new message`);

    const id = await messageRepository.create({conversationId: conversationId, senderId: senderId, content: content});
    return getById(id);
}

module.exports = {
    getById,create
};
  