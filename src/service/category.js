const { getLogger } = require('../core/logging');
const ServiceError = require('../core/serviceError');
const categoryRepository = require('../repository/category');

const debugLog = (message, meta = {}) => {
	if (!this.logger) this.logger = getLogger();
	this.logger.debug(message, meta);
};


/**
 * Get a category with the given `id`.
 *
 * @param {number} id - Id of the category to find.
 */
const getById = async (id) => {
	debugLog(`Fetching category with id ${id}`);
	const category = await categoryRepository.findById(id);
	if(!category){
		throw ServiceError.notFound(`There is no category with id ${id}`, {id});
	}
	return category;
}

/**
 * Get all places.
 */
const getAll = async() => {
	debugLog('Fetching all categories');
	const categories = await categoryRepository.findAll();
	return  { items: categories, count: categories.length };
};


/**
 * Create a new category.
 *
 * @param {object} category - Category to create.
 * @param {string} category.name - Name of the category.
 * @param {string} category.blobName - Image blobName.
 * @param {string} category.imageUrl - Url of the image.
 */
const create = async({name,blobName, imageUrl}) => {
	debugLog(`Creating new category with name ${name}`);

	const id = await categoryRepository.create({name, blobName, imageUrl});
	return getById(id);
};

/**
 * Update an existing category.
 *
 * @param {number} id - Id of the category to update.
 * @param {object} category - The updated Category.
 * @param {string} category.name - Name of the category.
 * @param {string} category.blobName - Image blobName.
 * @param {string} category.imageUrl - Url of the image.
 *
 */
const update = async(id, {name, blobName, imageUrl}) => {
	debugLog(`Updating category with name ${name}`);
	
	//Throwt ServiceError.notFound als categorie niet bestaat
	await getById(id);

	await categoryRepository.updateById(id, {name, blobName, imageUrl});
	return getById(id);
};

/**
 * Delete the category with the given `id`.
 *
 * @param {number} id - Id of the transaction to delete.
 */
const deleteById = async(id) => {
	debugLog(`Deleting category with id ${id}`);

	//Throwt ServiceError.notFound als categorie niet bestaat
	await getById(id);
	
	await categoryRepository.deleteById(id);
};


module.exports = {
	getAll, create, update, deleteById, getById
};
  