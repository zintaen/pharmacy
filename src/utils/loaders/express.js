/* eslint-disable no-console */
import bodyParser from 'body-parser';

import config from '~/config';
import appRouter from '~/routes';
import { customExpressErrorHandler } from '~/utils/helpers/errorHandler';

export const expressLoader = async (app) => {
   app.use(bodyParser.json());
   app.use(bodyParser.urlencoded({ extended: true }));

   app.use('/', appRouter);

   // Custom default error handle middleware (Need to keep 4 parameters)
   // Read more: https://expressjs.com/en/guide/error-handling.html
   app.use(customExpressErrorHandler);

   if (config.ENV !== 'test') {
      app.listen(config.PORT, () => console.info(`Server started at http://localhost:${config.PORT}`));
   }
};
