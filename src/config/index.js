import dotenv from 'dotenv';

dotenv.config();

export default {
   ENV: process.env.NODE_ENV,
   PORT: process.env.PORT || 3000,
   MONGOOSE_URI: process.env.MONGOOSE_URI,

   JWT_SECRET: process.env.JWT_SECRET,
   TOKEN_EXPIRE_IN: '3h',

   ADMIN_FULLNAME: process.env.ADMIN_FULLNAME,
   ADMIN_EMAIL: process.env.ADMIN_EMAIL,
   ADMIN_USERNAME: process.env.ADMIN_USERNAME,
   ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
};
