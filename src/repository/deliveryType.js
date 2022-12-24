const { PrismaClientKnownRequestError } = require('@prisma/client/runtime');
const { getLogger } = require('../core/logging');
const {
	getPrisma
} = require('../data');

/**
 * Find all deliveryTypes.
 */
const findAll = async () => {
	const deliveryTypes = await getPrisma().deliveryType.findMany();
	return deliveryTypes;
}

/**
 * Find a deliveryType with the given `id`.
 * 
 * @param {number} id - Id of the deliveryType to find.
 */
const findById = async(id) => {
    const deliveryType = await getPrisma().deliveryType.findUnique({
        where: {
            id: id
        }
    });
	return deliveryType;
};

/**
 * Create a new deliveryType with the given `name`.
 *
 * @param {object} deliveryType - DeliveryType to create.
 * @param {string} deliveryType.name - Name of the deliveryType
 *
 * @returns {Promise<number>} Created deliveryType id
 */
const create = async ({name}) => {
	try {
		const newdeliveryType = await getPrisma().deliveryType.create({
			data: {
				name: name
			}
		});
		return newdeliveryType.id;
	} catch (error) {
		const logger = getLogger();
		logger.error('Error in create', {
			error
		});
	}
}

/**
 * Update an existing deliveryType.
 *
 * @param {number} id - Id of the deliveryType to update.
 * @param {object} deliveryType - DeliveryType to create.
 * @param {string} deliveryType.name - Name of the deliveryType
 *
 * @returns {Promise<number>} Created deliveryType id
 */
const updateById = async (id, {name}) => {
	try {
		await getPrisma().deliveryType.update({
			where: {
				id: id
			},
			data: {
				name: name
			}
		});
		return id;
	} catch (error) {
		const logger = getLogger();
		logger.error('Error in update', {
			error
		});
		//P2025 = "An operation failed because it depends on one or more records that were required but not found. {cause}"
		if(error.code !=="P2025")
			throw error;
	}

}

/**
 * Delete the deliveryType with the given `id`
 *
 * @param {number} id - Id of the deliveryType to delete.
 *
 * @returns {Promise<boolean>} Whether the deliveryType was deleted.
 */
const deleteById = async (id) => {
	try {
		await getPrisma().deliveryType.delete({
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

module.exports = {
	findAll,
	updateById,
	create,
	deleteById,
	findById
}