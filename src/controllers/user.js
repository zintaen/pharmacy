import { StatusCodes } from 'http-status-codes';

import Model from '~/models/user';
import { ErrorHandler } from '~/utils/helpers/errorHandler';

export default {
   register: async (req, res, next) => {
      const { body } = req;

      try {
         const record = new Model(body);
         await record.save();

         res.json(record);
      } catch (e) {
         const resError = new ErrorHandler(
            StatusCodes.INTERNAL_SERVER_ERROR,
            e,
         );
         next(resError);
      }
   },

   login: async (req, res, next) => {
      const { username, password } = req.body;

      try {
         const user = await Model.findOne({ username });

         if (user) {
            const response = await user.login(password);
            res.json(response);
         }

         throw new ErrorHandler(StatusCodes.NOT_FOUND, 'User not found');
      } catch (e) {
         next(e);
      }
   },

   me: async (req, res, next) => {
      const { user } = req;

      if (user) {
         res.json(user);
      } else {
         const resError = new ErrorHandler(
            StatusCodes.NOT_FOUND,
            'User not found',
         );

         next(resError);
      }
   },

   update: async (req, res, next) => {
      const { user, body } = req;
      const availableUpdateFields = [
         'fullname',
         'password',
         'address',
         'phone',
      ];

      function shouldUpdate(key) {
         const isValidField = availableUpdateFields.includes(key);
         return isValidField;
      }

      Object.keys(body).forEach((key) => {
         if (shouldUpdate(key)) {
            user[key] = body[key];
         }
      });

      try {
         await user.save();
         res.json(user.removeProtectedFields());
      } catch (e) {
         const resError = new ErrorHandler(
            StatusCodes.INTERNAL_SERVER_ERROR,
            'Fail to update user',
         );

         next(resError);
      }
   },
};
