const { getPrisma } = require('../data/index');
const {  CONVERSATION_SELECT } = require('./querySelects');

/**
 * Find a conversation with the given `id`.
 *
 * @param {number} id - Id of the conversation to find.
 */
const findById = async (id) => {
    try{
        const conversation = await getPrisma().conversation.findUnique({
            where:{
                id: id
            },
            select: CONVERSATION_SELECT
        });
        return conversation;
    }catch(error){
        throw error;
    }
}


/**
 * Find all conversations by users with the given `userId`.
 *
 * @param {number} userId - Id of the user to find conversations.
 */
const findAllByUserId = async(userId) => {
	const conversations = await getPrisma().conversation.findMany({
        where: {
            OR: [
                {
                    AND : [
                        {
                            postOwnerId: userId
                        },
                        {
                            deletedByPostOwner: false
                        }
                    ]
                },
                {
                    AND : [
                        {
                            postReplierId: userId
                        },
                        {
                            deletedByPostReplier: false
                        }
                    ]
                }
            ]
        },
        select: CONVERSATION_SELECT,
    });
    return conversations && formatConversationList(conversations);
}

/**
 * Create a new conversation with the given `postId`, `postReplierId`.
 *
 * @param {object} conversation - Conversation to create.
 * @param {number} conversation.postId - The id of the post for which the conversation is created.
 * @param {number} conversation.postReplierId- The id of the user that has created a conversation to reply to a post.
 *
 * @returns {Promise<number>} Created conversation id
 */
const create = async({postId, postReplierId}) => {
    try {
        const post = await getPrisma().post.findUnique({
            where: {
                id: postId
            }

        });
        const newConversation = await getPrisma().conversation.create({
            data: {
                postId:postId,
                postOwnerId: post.userId,
                postReplierId: postReplierId
            }
        });
        return newConversation.id;
    } catch(error){
		const logger = getLogger();
		logger.error('Error in create', {error});
        throw error;
    }
}

/**
 * Delete the conversation with the given `id`.
 *
 * @param {number} id - Id of the conversation to delete.
 *
 * @returns {Promise<boolean>} Whether the conversation was deleted.
 */
const deleteById = async(id) => {
    try{
        await getPrisma().conversation.delete({
            where: {
                id: id
            }
        });
        return true;
    } catch(error){
		const logger = getLogger();
		logger.error('Error in deleteById', {error});
        //P2025 = "An operation failed because it depends on one or more records that were required but not found. {cause}"
		if(error.code !=="P2025")
            throw error;
        return false;
	}
}

/**
 * Soft Delete a conversation (deletedByPostReplier or deletedByPostOwner) and add a message to show the user has left the conversation.
 *
 * @param {number} id - Id of the conversation to soft delete.
 * @param {number} userId - Id of the user that is deleting the conversation.
 *
 * @returns {Promise<boolean>} Whether the conversation was soft deleted.
 */
const softDeleteById = async(id, userId) => {
    const oldConversation = await findById(id);

    const update = oldConversation.postReplier.id === userId ? {deletedByPostReplier: true} : {deletedByPostOwner: true};
    //Message wordt toegevoegd zodat andere gebruiker kan zien dat hij het gesprek verlaten heeft
    const deletedMessage = `${oldConversation.postReplier.id === userId ? oldConversation.postReplier.username : oldConversation.postOwner.username} has left the conversation..`;

    try {
        await getPrisma().conversation.update({
            where:{
                id: id
            },
            data: {
                ...update,
                messages: {
                    create: {
                        senderId: userId, 
                        content: deletedMessage
                    }
                }
            }
        });
        return true;
    }catch(error){
		const logger = getLogger();
		logger.error('Error in softDeleteById', {error});

        //P2025 = "An operation failed because it depends on one or more records that were required but not found. {cause}"
		if(error.code !=="P2025")
            throw error;
            
        return false;
    }

}

//HULPMETHODEN
const formatConversationList = (conversations) => {
    return conversations.map((conversation) => {
        const lastMessage = conversation.messages && conversation.messages[conversation.messages.length-1];
        return ({ ...conversation, lastMessage:lastMessage});
    }).sort((c1, c2) => c2.lastMessage?.timestamp - c1.lastMessage?.timestamp);
}

module.exports = {
   findById,create, findAllByUserId,deleteById, softDeleteById, deleteById
}