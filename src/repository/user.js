const { getLogger } = require('../core/logging');
const { getPrisma } = require('../data/index');
const { USER_SELECT } = require('./querySelects');


/**
 * Find all users.
 */
const findAll = async() => {
	const users = await getPrisma().user.findMany({
        select: USER_SELECT
    });
    return users;
}

/**
 * Find a user with the given `id`.
 * @param {number} id - Id of the user to find.
 */
const findById = async(id) => {
    const user = await getPrisma().user.findUnique({
        where: {
            id:id
        },
        select: USER_SELECT
    });
    return user;
}

/**
 * Create a new user with the given `auth0id` and `username`.
 *
 * @param {object} user- User to create.
 * @param {string} user.auth0id - Auth0id of the user.
 * @param {string} user.username - Username of the user.

 * @returns {Promise<number>} Created user id
 */
const create = async({auth0id,username}) => {
    try {
        const newUser = await getPrisma().user.create({
            data: {
                username: username,
                auth0id: auth0id,
            }
        });
        return newUser.id;
    } catch(error){
		const logger = getLogger();
		logger.error('Error in create', {error});
		throw error;
    }
}

/**
 * Delete the user with the given `id`.
 *
 * @param {number} id - Id of the user to delete.
 *
 * @returns {Promise<boolean>} Whether the user was deleted.
 */
const deleteById = async(id) => {
    try {
        await getPrisma().user.delete({
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
 * Update an existing user.
 *
 * @param {number} id - Id of the user to update.
 * @param {object} user - User data to save
 * @param {string} user.auth0id - Auth0id of the user.
 * @param {string} user.username - Username of the user.

 * @returns {Promise<number>} Created user id
 */
const updateById = async(id,{username, auth0id}) => {
    try {
        const updatedUser = await getPrisma().user.update({
            where: {
                id
            },
            data: {
                username: username,
                auth0id: auth0id
            }
        });
        return updatedUser.id;
    } catch(error){
        const logger = getLogger();
		logger.error('Error in deleteById', {error});
        throw error;
    }
}

/**
 * Find a user with the given `auth0id`.
 * @param {number} id - Auth0 id of the user to find.
 */
const findByAuth0Id = async(auth0id) => {
    const user = await getPrisma().user.findUnique({
        where: {
            auth0id: auth0id
        }
    });
    return user;
}
module.exports = {
    findAll, findById,create, deleteById, updateById, findByAuth0Id
}