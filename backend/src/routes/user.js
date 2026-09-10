import express from 'express';
import { authorize } from '../middleware/auth.js';
import {
  getStores,
  submitRating,
  getUserRating
} from '../controllers/userController.js';

const router = express.Router();

// Middleware to check normal user role
router.use(authorize(['NORMAL_USER']));

router.get('/stores', getStores);
router.post('/ratings', submitRating);
router.get('/ratings/:storeId', getUserRating);

export default router;
