import * as Joi from '@hapi/joi';

export const userValidationSchemas = {
  create: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }),

  update: Joi.object({
    name: Joi.string().optional(),
    email: Joi.string().email().optional(),
    password: Joi.string().min(6).optional(),
  }),

  delete: Joi.object({
    id: Joi.string().required(), // Ensure ID is provided for delete
  }),
};
