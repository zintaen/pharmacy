/* eslint-disable no-console */
import mongoose from 'mongoose';

import User, { USER_ROLES } from '~/models/user';
import config from '~/config';

export const mongooseLoader = async () => {
   const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
   };

   const isTestMode = config.ENV === 'test';
   const databaseUri = config.MONGOOSE_URI + (isTestMode ? '_test' : '');
   mongoose.connect(databaseUri, options);

   const db = mongoose.connection;

   db.on('error', console.error.bind(console, 'connection error:'));

   db.once('open', async () => {
      console.info('Database connected!');

      const hasAdminAccount = await User.findOne({ role: USER_ROLES.ADMIN });

      if (!hasAdminAccount) {
         const account = new User({
            role: USER_ROLES.ADMIN,
            email: config.ADMIN_EMAIL,
            username: config.ADMIN_USERNAME,
            fullname: config.ADMIN_FULLNAME,
            password: config.ADMIN_PASSWORD,
         });

         await account.save();
      }
   });
};
