const { getLogger } = require('../core/logging');
const { getPrisma } = require('../data/index');
const { USER__DETAILED_SELECT } = require('../repository/querySelects');
const userRepository = require('../repository/user');
const ServiceError = require('../core/serviceError')
const debugLog = (message, meta = {}) => {
	if (!this.logger) this.logger = getLogger();
	this.logger.debug(message, meta);
};

/**
 * Get all users.
 */
const getAll = async() => {
    debugLog('Fetching all users');
	const users = await userRepository.findAll();
    return { items: users, count: users.length};
}


/**
 * Get the user with the given `id`.
 * @param {number} id - Id of the user to find.
 * 
 */
const getById = async(id) => {
	debugLog(`Fetching user with id ${id}`);
	const user = await userRepository.findById(id);
    if(!user){
		throw ServiceError.notFound(`There is no user with id ${id}`, {id});
	}
    return user;
};

/**
 * Update an existing user.
 *
 * @param {number} id - Id of the user to update.
 * @param {object} user - User data to save
 * @param {string} user.auth0id - Auth0id of the user.
 * @param {string} user.username - Username of the user.

 */
const updateById = async(id, {username, auth0id}) => {
    debugLog(`Updating user with id ${id}`);

    //Throwt ServiceError.notFound als user niet bestaat
    await getById(id);

    await userRepository.updateById(id, {username, auth0id})
    return getById(id);
}

const deleteById = async(id) => {
    await userRepository.deleteById(id);
}

/**
 * Get the user with the given `auth0id`.
 * @param {number} id - Auth0 id of the user to find.
 */
const getByAuth0Id = async (auth0id) => {
    debugLog(`Fetching user with auth0id ${auth0id}`);
    const user = await userRepository.findByAuth0Id(auth0id);
  
    if (!user) {
      throw ServiceError.notFound(`No user with id ${auth0id} exists`, {
        auth0id,
      });
    }
    return user;
};

/**
 * Create a new user with the given `auth0id` and `username`.
 *
 * @param {object} user- User to create.
 * @param {string} user.auth0id - Auth0id of the user.
 * @param {string} user.username - Username of the user.
 * 
 */
const register = async({auth0id, username }) => {
    debugLog('Creating a new user', {
      username,
    });

    const id = await userRepository.create({
        auth0id,
        username
    });
    return getById(id);
};


module.exports = {
	getById,  updateById, getAll, deleteById,  register, getByAuth0Id
};
  