import Joi from 'joi';
import { StatusCodes } from 'http-status-codes';

import validateMiddleware from '~/middlewares/validator';
import { ErrorHandler } from '~/utils/helpers/errorHandler';

const schema = Joi.object({
   name: Joi
      .string()
      .min(3)
      .max(120)
      .required(),

   price: Joi
      .number()
      .min(0)
      .required(),

   description: Joi.string(),

}).error(
   new ErrorHandler(
      StatusCodes.UNPROCESSABLE_ENTITY,
      'Data validate failed! Please check again',
   ),
);

export default validateMiddleware(schema);
