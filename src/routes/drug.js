import { Router } from 'express';

import ctrl from '~/controllers/drug';
import { USER_ROLES } from '~/models/user';
import validate from '~/validators/drug';
import auth from '~/middlewares/auth';

const router = Router();

const { ADMIN } = USER_ROLES;

router
   .route('/')
   .get(ctrl.index)
   .post(validate, auth([ADMIN]), ctrl.create);

router
   .route('/:id')
   .get(ctrl.get)
   .patch(validate, auth([ADMIN]), ctrl.update)
   .delete(auth([ADMIN]), ctrl.delete);

export default router;
