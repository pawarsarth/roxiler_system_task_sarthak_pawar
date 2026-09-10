import express from 'express';
import { authorize } from '../middleware/auth.js';
import { getStoreDashboard } from '../controllers/storeOwnerController.js';

const router = express.Router();

// Middleware to check store owner role
router.use(authorize(['STORE_OWNER']));

router.get('/dashboard', getStoreDashboard);

export default router;
