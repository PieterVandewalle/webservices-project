const { getPrisma } = require('../data/index');
const { MESSAGE_SELECT } = require('./querySelects');

/**
 * Create a new message in the conversation with the given `conversationId`,`content` and `senderId`.
 *
 * @param {object} message - Message to create
 * @param {number} message.conversationId - Id of the conversation in which the message is placed
 * @param {string} message.content - The messate content
 * @param {number} message.senderId - UserId of the message sender.
 *
 * @returns {Promise<number>} Created message id
 */
const create = async({conversationId, content, senderId}) => {
    const newMessage= await getPrisma().message.create({
        data: {
            conversationId: conversationId,
            content: content,
            senderId: senderId
        }
    });
    return newMessage.id;
}

/**
 * Find a message with the given `id`.
 *
 * @param {number} id - Id of the message to find.
 */
const findById = async(id) => {
    const message = await getPrisma().message.findUnique({
        where: {
            id: id
        },
        select: MESSAGE_SELECT
        
    });
    return message;
}

module.exports = {
    create, findById
}