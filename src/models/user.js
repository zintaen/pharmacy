import mongoose, { Schema } from 'mongoose';
import { StatusCodes } from 'http-status-codes';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import config from '~/config';
import { ErrorHandler } from '~/utils/helpers/errorHandler';

export const USER_ROLES = {
   CUSTOMER: 'CUSTOMER',
   ADMIN: 'ADMIN',
};

const userSchema = new Schema(
   {
      role: {
         type: Schema.Types.String,
         enum: [USER_ROLES.CUSTOMER, USER_ROLES.ADMIN],
         default: USER_ROLES.CUSTOMER,
      },
      username: {
         type: Schema.Types.String,
         unique: true,
         required: true,
      },
      fullname: {
         type: Schema.Types.String,
         required: true,
      },
      email: {
         type: Schema.Types.String,
         unique: true,
         required: true,
      },
      password: {
         type: Schema.Types.String,
         required: true,
      },
      address: {
         type: Schema.Types.String,
      },
      phone: {
         type: Schema.Types.String,
      },
   },
   {
      timestamps: true,
   },
);

userSchema.pre('save', async function () {
   const user = this;
   const isPasswordUpdated = user.isModified('password');

   if (isPasswordUpdated) {
      const hashedPassword = await bcrypt.hash(user.password, 8);
      user.password = hashedPassword;
   }
});

userSchema.methods.removeProtectedFields = function () {
   const {
      _id, role, password, ...normalizedUser
   } = this.toObject();

   return { id: _id, ...normalizedUser };
};

userSchema.methods.login = async function (inputPassword) {
   const { password: hashedPassword, _id: userId, role } = this;

   const isPassed = await bcrypt.compare(inputPassword, hashedPassword);

   if (isPassed) {
      const token = jwt.sign({ userId, role }, config.JWT_SECRET, {
         expiresIn: config.TOKEN_EXPIRE_IN,
      });

      return { token, user: this.removeProtectedFields() };
   }

   throw new ErrorHandler(StatusCodes.FORBIDDEN, 'Login information wrong');
};

export default mongoose.model('user', userSchema);
