const Joi = require('joi');
const deliveryTypeService = require('../service/deliveryType');
const categoryService = require('../service/category');

const JOI_OPTIONS = {
  abortEarly: true,
  allowUnknown: false,
  context: true,
  convert: true,
  presence: 'required',
};

const cleanupJoiError = (error) => error.details.reduce((resultObj, {
  message,
  path,
  type,
}) => {
  const joinedPath = path.join('.') || 'value';
  if (!resultObj[joinedPath]) {
    resultObj[joinedPath] = [];
  }
  resultObj[joinedPath].push({
    type,
    message,
  });

  return resultObj;
}, {});

// Validate functie aangepast -> validateAsync moet gebruikt worden bij gebruik external validation functions zoals deliveryTypeExists
const validate = (schema) => {
  if (!schema) {
    schema = {
      query: {},
      body: {},
      params: {},
    };
  }

  return async (ctx, next) => {
    const errors = await Object.keys(schema).reduce(async (result, key) => {
      const res = await result;
      if (!Joi.isSchema(schema[key]))
          schema[key] = Joi.object(schema[key]);
      let error;
      const value = await schema[key].validateAsync(ctx.request[key], JOI_OPTIONS).catch(validationError => {
        error = validationError;
      });
      if (error)
        res[key] = cleanupJoiError(error);
      else {
        Object.keys(ctx.request[key]).forEach(valueKey => {
          ctx.request[key][valueKey]= value[valueKey];
        });
      }
      return res;
  }, Promise.resolve({}));
    if (Object.keys(errors).length) {
      ctx.throw(400, 'Validation failed, check details for more information', {
        code: 'VALIDATION_FAILED',
        details: errors,
      });
    }
    return next();
  };
};


const deliveryTypeExists = async(value) => {
  const {items: deliveryTypes}  = await deliveryTypeService.getAll();
  const exists = deliveryTypes.map(({id}) => id).includes(value);

  if(exists){
    return value;
  }

  const message = `DeliveryType with id ${value} does not exist`;
  throw new Joi.ValidationError(message, [
    {
      type: "any.external",
      message: message,
      path: ["deliveryTypeId"]
    }
  ]);
}

const categoryExists = async(value) => {
  const {items: categories} = await categoryService.getAll();
  const exists = categories.map(({id}) => id).includes(value);

  if(exists){
    return value;
  }

  const message = `Category with id ${value} does not exist`;
  throw new Joi.ValidationError(message, [
    {
      type: "any.external",
      message: message,
      path: ["categoryId"]
    }
  ]);
}


module.exports = {
  validate,
  deliveryTypeExists,
  categoryExists
};




