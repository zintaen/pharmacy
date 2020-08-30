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
         next(e);
      }
   },

   login: async (req, res, next) => {
      const { username, password } = req.body;

      try {
         const user = await Model.findOne({ username });

         if (user) {
            const response = await user.login(password);
            return res.json(response);
         }

         throw new ErrorHandler(
            StatusCodes.FORBIDDEN,
            'Login information wrong',
         );
      } catch (e) {
         next(e);
      }
   },

   me: async (req, res, next) => {
      const { user } = req;

      if (user) {
         const userData = user.removeProtectedFields();
         return res.json(userData);
      }

      throw new ErrorHandler(StatusCodes.NOT_FOUND, 'User not found');
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
         next(e);
      }
   },
};
