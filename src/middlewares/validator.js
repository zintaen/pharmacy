import Joi from 'joi';
import { StatusCodes } from 'http-status-codes';
import { ErrorHandler } from '~/utils/helpers/errorHandler';

export default (schema) => (req, res, next) => {
   const isJoiSchema = Joi.isSchema(schema);

   if (!isJoiSchema) {
      return next(
         new ErrorHandler(
            StatusCodes.INTERNAL_SERVER_ERROR,
            'Fail with validation, wrong schema',
         ),
      );
   }

   const { body } = req;
   const { error } = schema.validate(body);

   if (error) {
      return next(error);
   }

   return next();
};
