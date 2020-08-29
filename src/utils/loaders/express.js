/* eslint-disable no-console */
import bodyParser from 'body-parser';

import config from '~/config';
import appRouter from '~/routes';
import { handleError } from '~/utils/helpers/errorHandler';

export const expressLoader = async (app) => {
   app.use(bodyParser.json());
   app.use(bodyParser.urlencoded({ extended: true }));

   app.use('/', appRouter);

   // Custom default error handle middleware (Need to keep 4 parameters)
   // Read more: https://expressjs.com/en/guide/error-handling.html
   app.use((err, req, res, next) => {
      handleError(err, res);
   });

   app.listen(config.PORT, () => {
      console.log(`Server is listening at http://localhost:${config.PORT}`);
   });
};
