import { StatusCodes } from 'http-status-codes';

import Model from '~/models/drug';
import { ErrorHandler } from '~/utils/helpers/errorHandler';

export default {
   index: async (req, res, next) => {
      try {
         const records = await Model.find();
         res.json(records);
      } catch (e) {
         next(
            new ErrorHandler(
               StatusCodes.INTERNAL_SERVER_ERROR,
               'Fail to fetch!',
            ),
         );
      }
   },

   get: async (req, res, next) => {
      try {
         const record = await Model.findById(req.params.id);
         res.json(record);
      } catch (e) {
         next(
            new ErrorHandler(
               StatusCodes.INTERNAL_SERVER_ERROR,
               'Fail to fetch!',
            ),
         );
      }
   },

   create: async (req, res, next) => {
      const { body } = req;

      try {
         const record = new Model(body);
         await record.save();

         res.json(record);
      } catch (e) {
         next(
            new ErrorHandler(
               StatusCodes.INTERNAL_SERVER_ERROR,
               'Fail to create new product',
            ),
         );
      }
   },

   update: async (req, res, next) => {
      const { body } = req;
      const { id } = req.params;

      try {
         const record = await Model.findByIdAndUpdate(id, body, { new: true });
         res.json(record);
      } catch (e) {
         next(
            new ErrorHandler(
               StatusCodes.INTERNAL_SERVER_ERROR,
               'Fail to update product',
            ),
         );
      }
   },

   delete: async (req, res, next) => {
      const { id } = req.params;

      try {
         const record = await Model.findByIdAndDelete(id);
         res.json(record);
      } catch (e) {
         next(
            new ErrorHandler(
               StatusCodes.INTERNAL_SERVER_ERROR,
               'Fail to delete product',
            ),
         );
      }
   },
};
