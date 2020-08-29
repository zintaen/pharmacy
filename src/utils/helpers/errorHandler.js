import { StatusCodes } from 'http-status-codes';

export class ErrorHandler extends Error {
   constructor(statusCode, message) {
      super();
      this.statusCode = statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
      this.message = message;
   }
}

export const handleError = (err, res) => {
   const { statusCode, message } = err;

   res.status(statusCode).json({
      status: 'error',
      statusCode,
      message,
   });
};
