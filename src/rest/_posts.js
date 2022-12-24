const Router = require('@koa/router');
const { permissions, hasPermission, requirePostOwner, registerAndSetUserId } = require('../core/auth');
const { addFilesToImageObject, createUploadMiddleware } = require('../core/image');
const postService = require('../service/post');
const Joi = require('joi');
const { validate, deliveryTypeExists, categoryExists } = require('./_validation');

const getAllPosts = async (ctx) => {
  ctx.body = await postService.getAll({...ctx.query}, ctx.state.userId);
}

getAllPosts.validationScheme = {
  query: Joi.object({
    searchterm: Joi.string().max(200).optional(),
    order: Joi.string().valid("date-asc", "date-desc", "price-desc", "price-asc").optional(),
    categoryId: Joi.number().integer().positive().optional(),
    deliveryTypeId: Joi.number().integer().positive().optional(),
    minPrice: Joi.number().min(0).when("maxPrice",{
      is: Joi.exist(),
      then: Joi.number().max(Joi.ref("maxPrice")),
    }).optional(),
    maxPrice: Joi.number().min(0).optional(),
    limit: Joi.number().integer().positive().max(1000).optional(),
    offset: Joi.number().integer().min(0).optional(),
  }).and('limit', 'offset')
};

const getPostById = async (ctx) => {
  ctx.body = await postService.getById(ctx.params.id, ctx.state.userId);
}

getPostById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
}

const createPost = async (ctx) => {
  ctx.body = await postService.create({
    ...ctx.request.body,
    userId: ctx.state.userId
  });
  ctx.status = 201;
}

createPost.validationScheme = {
  body: {
    title: Joi.string().min(2).max(50),
    categoryId: Joi.number().integer().positive().external(categoryExists),
    deliveryTypeId: Joi.number().integer().positive().external(deliveryTypeExists),
    description: Joi.string().max(5000),
    city: Joi.string().min(2).max(50),
    price: Joi.number().min(0).max(100000),
    images: Joi.array().max(5).items(
      Joi.object({
        blobName: Joi.string(),
        url: Joi.string()
      })
    )
  },
}

const updatePostById = async (ctx) => {
  ctx.body = await postService.updateById(ctx.params.id,{
    ...ctx.request.body,
    userId: ctx.state.userId
  });
}

updatePostById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
  body: {
    title: Joi.string().min(2).max(50),
    categoryId: Joi.number().integer().positive().external(categoryExists),
    deliveryTypeId: Joi.number().integer().positive().external(deliveryTypeExists),
    description: Joi.string().max(5000),
    city: Joi.string().min(2).max(50),
    price: Joi.number().min(0).max(100000),
    images: Joi.array().max(5).items(
      Joi.object({
        id: Joi.number().integer().positive().optional(),
        blobName: Joi.string(),
        url: Joi.string()
      })
    )
  }
}

const deletePostById = async (ctx) => {
  await postService.deleteById(ctx.params.id);
  ctx.status = 204;
}

deletePostById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
}

const uploadPostImages = createUploadMiddleware(5);

module.exports = (app) => {
  const router = new Router({
    prefix: '/posts',
  });
  router.get('/', registerAndSetUserId, validate(getAllPosts.validationScheme), getAllPosts);
  router.get('/:id', registerAndSetUserId, validate(getPostById.validationScheme), getPostById);
  router.post('/', registerAndSetUserId, hasPermission(permissions.user),uploadPostImages, addFilesToImageObject,validate(createPost.validationScheme), createPost);
  router.put('/:id',registerAndSetUserId, hasPermission(permissions.user), uploadPostImages,addFilesToImageObject, validate(updatePostById.validationScheme),requirePostOwner, updatePostById);
  router.delete('/:id',registerAndSetUserId, hasPermission(permissions.user), validate(deletePostById.validationScheme),requirePostOwner, deletePostById);
  app
    .use(router.routes())
    .use(router.allowedMethods());
};