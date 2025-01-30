import * as Joi from '@hapi/joi';

export const sendEmailSchema = Joi.object({
  to: Joi.string().email().required(),
  subject: Joi.string().required(),
  text: Joi.string().required(),
  attachments: Joi.array().optional(),
});
