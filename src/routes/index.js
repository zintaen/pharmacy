import { Router } from 'express';

import userRoutes from './user';
import drugRoutes from './drug';

const router = Router();

router.use('/users', userRoutes);
router.use('/drugs', drugRoutes);

export default router;
