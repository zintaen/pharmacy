import { Router } from 'express';

import validate from '~/validators/user';
import ctrl from '~/controllers/user';
import auth from '~/middlewares/auth';

const router = Router();

router
   .route('/register')
   .post(validate, ctrl.register);

router
   .route('/login')
   .post(ctrl.login);

router
   .route('/me')
   .get(auth(), ctrl.me)
   .patch(auth(), ctrl.update);

export default router;
