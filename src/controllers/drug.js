import { StatusCodes } from 'http-status-codes';

import Model from '~/models/drug';
import { ErrorHandler } from '~/utils/helpers/errorHandler';

export default {
   index: async (req, res, next) => {
      try {
         const records = await Model.find();
         res.json(records);
      } catch (e) {
         next(e);
      }
   },

   get: async (req, res, next) => {
      try {
         const record = await Model.findById(req.params.id);
         res.json(record);
      } catch (e) {
         next(e);
      }
   },

   create: async (req, res, next) => {
      const { body } = req;

      try {
         const record = new Model(body);
         await record.save();

         res.json(record);
      } catch (e) {
         next(e);
      }
   },

   update: async (req, res, next) => {
      const { body } = req;
      const { id } = req.params;

      try {
         const record = await Model.findByIdAndUpdate(id, body, { new: true });

         if (record) {
            res.json(record);
            return;
         }

         throw new ErrorHandler(StatusCodes.NOT_FOUND, 'Drug not found');
      } catch (e) {
         next(e);
      }
   },

   delete: async (req, res, next) => {
      const { id } = req.params;

      try {
         const record = await Model.findByIdAndDelete(id);

         if (record) {
            res.json(record);
            return;
         }

         throw new ErrorHandler(StatusCodes.NOT_FOUND, 'Drug does not exist!');
      } catch (e) {
         next(e);
      }
   },
};
