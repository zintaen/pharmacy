import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';

import { ErrorHandler } from '~/utils/helpers/errorHandler';
import userModel from '~/models/user';
import config from '~/config';

export default (roles) => async (req, res, next) => {
   const authHeader = req.headers.authorization;

   if (authHeader) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, config.JWT_SECRET);

      const isValidRole = Array.isArray(roles) ? roles.includes(decoded.role) : true;

      if (isValidRole) {
         try {
            const authUser = await userModel.findById(decoded.userId);
            req.user = authUser;
            return next();
         } catch (e) {
            return next(
               new ErrorHandler(
                  StatusCodes.NOT_FOUND,
                  "Can't find this user",
               ),
            );
         }
      } else {
         return next(
            new ErrorHandler(
               StatusCodes.FORBIDDEN,
               `You don't have permission as ${roles.join(' | ')}`,
            ),
         );
      }
   }

   return next(
      new ErrorHandler(
         StatusCodes.UNAUTHORIZED,
         'Please login to use this API',
      ),
   );
};
