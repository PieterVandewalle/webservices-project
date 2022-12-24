const Router = require('@koa/router');
const categoryService = require('../service/category');
const Joi = require('joi');
const { validate} = require('./_validation');
const { hasPermission, permissions } = require('../core/auth');
const { addFileToCategoryObject, createUploadMiddleware} = require('../core/image');

//Public routes
const getAllCategories = async (ctx) => ctx.body = await categoryService.getAll();

const getCategoryById = async(ctx) => ctx.body = await categoryService.getById(ctx.params.id);
getCategoryById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
}

//Admin routes
const createCategory = async(ctx) => {
  ctx.body = await categoryService.create(ctx.request.body);
  ctx.status = 201;
}
createCategory.validationScheme = {
    body: {
      name: Joi.string(),
      imageUrl: Joi.string(),
      blobName: Joi.string()
    }
}

const updateCategory = async(ctx) => {
  ctx.body = await categoryService.update(ctx.params.id, ctx.request.body);
};
updateCategory.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
  body: {
    name: Joi.string().max(20),
    imageUrl: Joi.string(),
    blobName: Joi.string()
  }
}

const deleteCategory = async(ctx) => {
  ctx.body = await categoryService.deleteById(ctx.params.id);
  ctx.status = 204;
}
deleteCategory.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
}
const uploadSingleImage = createUploadMiddleware(1);

module.exports = (app) => {
    const router = new Router({
      prefix: '/categories',
    });
    router.get('/', getAllCategories);
    router.get('/:id', validate(getCategoryById.validationScheme), getCategoryById);
    router.post('/',hasPermission(permissions.admin), uploadSingleImage, addFileToCategoryObject, validate(createCategory.validationScheme),createCategory);
    router.put('/:id', hasPermission(permissions.admin), uploadSingleImage,addFileToCategoryObject, validate(updateCategory.validationScheme), updateCategory);
    router.delete('/:id',hasPermission(permissions.admin), validate(deleteCategory.validationScheme), deleteCategory);

    app
      .use(router.routes())
      .use(router.allowedMethods());
};
  