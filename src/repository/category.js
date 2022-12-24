const { deleteBlobs } = require('../core/image');
const { getLogger } = require('../core/logging');
const { getPrisma} = require('../data');
const { CATEGORY_SELECT } = require('./querySelects');

/**
 * Find all categories.
 */
const findAll = async() => {
	const categories = await getPrisma().category.findMany({
		select: CATEGORY_SELECT
	});
	return categories;
};

/**
 * Find a category with the given `id`.
 *
 * @param {number} id - Id of the category to find.
 */
const findById = async(id) => {
    const category = await getPrisma().category.findUnique({
        where: {
            id: id
        }
    });
	return category;
};

/**
 * Create a new category with the given `name` and `blobName` and `imageUrl`.
 *
 * @param {object} category - Category to create.
 * @param {string} category.name - Name of the category.
 * @param {string} category.blobName - Image blobName.
 * @param {string} category.imageUrl - Url of the image.
 *
 * @returns {Promise<number>} Created category id
 */
const create = async({name,blobName, imageUrl}) => {
	try {
		const newCategory = await getPrisma().category.create({
			data: {
				name: name,
				blobName: blobName,
				imageUrl: imageUrl
			}
		});
		return newCategory.id;
	} catch(error){
		const logger = getLogger();
		logger.error('Error in create', {error});
		throw error;
	}
};


/**
 * Update an existing category with the given `name` and `blobName` and `imageUrl`.
 *
 * @param {number} id - Id of the category to update.
 * @param {object} category - The updated Category.
 * @param {string} category.name - Name of the category.
 * @param {string} category.blobName - Image blobName.
 * @param {string} category.imageUrl - Url of the image.
 *
 * @returns {Promise<number>} Created category id
 */
const updateById = async(id, {name, blobName, imageUrl}) => {
	try {
		const previousCategory = await findById(id);

		await getPrisma().category.update({
			where: {
				id: id
			},
			data: {
				name: name,
				blobName: blobName,
				imageUrl: imageUrl,
			}
		});
		
		if(blobName !== previousCategory.blobName){
			await deleteBlobs(previousCategory.blobName);
		}

		return id;
	} catch (error) {
		const logger = getLogger();
		logger.error('Error in update', {error});
		throw error;
	}
};


/**
 * Delete the category with the given `id`.
 *
 * @param {number} id - Id of the category to delete.
 *
 * @returns {Promise<boolean>} Whether the category was deleted.
 */
const deleteById = async(id) => {
	const category = await findById(id);

	//Check of categorie bestaat
	if(!category)
		return false;


	try {
		await deleteBlobs(category.blobName);
		await getPrisma().category.delete({
			where: {
				id: id
			}
		});
		return true;
	} catch(error){
		const logger = getLogger();
		logger.error('Error in deleteById', {error});
	}

};

module.exports = {
    findAll,findById,updateById, create, deleteById,
}