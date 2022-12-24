const Router = require('@koa/router');
const deliveryTypeService = require('../service/deliveryType');
const { validate} = require('./_validation');
const Joi = require('joi');
const { hasPermission, permissions } = require('../core/auth');

//Public routes
const getAllDeliveryTypes = async (ctx) => ctx.body = await deliveryTypeService.getAll();

const getDeliveryTypeById = async(ctx) => ctx.body = await deliveryTypeService.getById(ctx.params.id);
getDeliveryTypeById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
}

//Admin routes
const createDeliveryType= async(ctx) => {
  ctx.body = await deliveryTypeService.create(ctx.request.body);
  ctx.status = 201;
}
createDeliveryType.validationScheme = {
  body: {
    name: Joi.string()
  }
}

const updateDeliveryType = async(ctx) => ctx.body = await deliveryTypeService.update(ctx.params.id, ctx.request.body);
updateDeliveryType.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
  body: {
    name: Joi.string().max(20),
  }
}

const deleteDeliveryType = async(ctx) => {
  ctx.body = await deliveryTypeService.deleteById(ctx.params.id);
  ctx.status = 204;
}
deleteDeliveryType.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
}


module.exports = (app) => {
    const router = new Router({
      prefix: '/deliverytypes',
    });
    router.get('/', getAllDeliveryTypes);
    router.get('/:id', validate(getDeliveryTypeById.validationScheme), getDeliveryTypeById);
    router.post('/', hasPermission(permissions.admin), validate(createDeliveryType.validationScheme),createDeliveryType);
    router.put('/:id',hasPermission(permissions.admin), validate(updateDeliveryType.validationScheme), updateDeliveryType);
    router.delete('/:id', hasPermission(permissions.admin), validate(deleteDeliveryType.validationScheme), deleteDeliveryType);

    app
      .use(router.routes())
      .use(router.allowedMethods());
};
  