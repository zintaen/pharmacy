import Joi from 'joi';
import { StatusCodes } from 'http-status-codes';

import { ErrorHandler } from '~/utils/helpers/errorHandler';
import validateMiddleware from '~/middlewares/validator';

const schema = Joi.object({
   username: Joi
      .string()
      .required(),

   fullname: Joi
      .string()
      .required(),

   email: Joi
      .string()
      .required(),

   password: Joi
      .string()
      .required(),

   address: Joi.string(),

   phone: Joi.string(),

}).error(
   new ErrorHandler(
      StatusCodes.UNPROCESSABLE_ENTITY,
      'Invalid data',
   ),
);

export default validateMiddleware(schema);
