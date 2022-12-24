const { getLogger } = require('../core/logging');
const ServiceError = require('../core/serviceError');
const { getPrisma } = require('../data/index');
const deliveryTypeRepository = require('../repository/deliveryType');

const debugLog = (message, meta = {}) => {
	if (!this.logger) this.logger = getLogger();
	this.logger.debug(message, meta);
};

/**
 * Get the deliveryType with the given `id`.
 * 
 * @param {number} id - Id of the deliveryType to find.
 */
const getById = async (id) => {
	debugLog(`Fetching deliverytype with id ${id}`);
	const deliveryType =  await deliveryTypeRepository.findById(id);
	if(!deliveryType){
		throw ServiceError.notFound(`There is no deliverytype with id ${id}`, {id});
	}
	return deliveryType;
}

/**
 * Get all deliveryTypes.
 */
const getAll = async() => {
	debugLog('Fetching all deliverytypes');
	const deliveryTypes= await deliveryTypeRepository.findAll();
	return  { items: deliveryTypes, count: deliveryTypes.length };
};

/**
 * Create a new deliveryType with the given `name`.
 *
 * @param {object} deliveryType - DeliveryType to create.
 * @param {string} deliveryType.name - Name of the deliveryType
 */
const create = async({name}) => {
	debugLog(`Creating new deliverytype with name ${name}`);
	const id = await deliveryTypeRepository.create({name});
	return getById(id);
};

/**
 * Update an existing deliveryType.
 *
 * @param {number} id - Id of the deliveryType to update.
 * @param {object} deliveryType - DeliveryType to create.
 * @param {string} deliveryType.name - Name of the deliveryType
 *
 */
const update = async(id, {name}) => {
	debugLog(`Updating deliveryType with name ${name}`);

	//Throwt ServiceError.notFound als deliveryType niet bestaat
	await getById(id);

	await deliveryTypeRepository.updateById(id, {name});
	return getById(id);
};

/**
 * Delete the deliveryType with the given `id`
 *
 * @param {number} id - Id of the deliveryType to delete.
 */
const deleteById = async(id) => {
	debugLog(`Deleting deliverytype with id ${id}`);
	await deliveryTypeRepository.deleteById(id);
};


module.exports = {
	getAll, create, update, deleteById, getById
};
  