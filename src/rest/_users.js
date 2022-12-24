const Router = require('@koa/router');
const userService = require('../service/user');
const postService = require('../service/post');
const {  hasPermission, permissions, registerAndSetUserId } = require('../core/auth');
const Joi = require('joi');
const { validate } = require('./_validation');
const getAllUsers = async(ctx) => ctx.body = await userService.getAll();

const getUserById = async (ctx) => ctx.body = await userService.getById(parseInt(ctx.params.id));
getUserById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
}
const updateUserById = async (ctx) => ctx.body = await userService.updateById(parseInt(ctx.params.id), ctx.request.body);
updateUserById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
  body: {
    username: Joi.string().max(30),
  },
};


const deleteUserById = async(ctx) => {
  await userService.deleteById(parseInt(ctx.params.id));
  ctx.status = 204;
}

deleteUserById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
}

module.exports = (app) => {
    const router = new Router({
      prefix: '/users',
    });
    
    router.get('/', registerAndSetUserId, hasPermission(permissions.admin), getAllUsers);
    router.get('/:id', registerAndSetUserId, hasPermission(permissions.admin), validate(getUserById.validationScheme), getUserById);
    router.put('/:id',registerAndSetUserId, hasPermission(permissions.admin), validate(updateUserById.validationScheme), updateUserById);
    router.delete('/:id',registerAndSetUserId, hasPermission(permissions.admin), validate(deleteUserById.validationScheme), deleteUserById);
    app
      .use(router.routes())
      .use(router.allowedMethods());
};
  