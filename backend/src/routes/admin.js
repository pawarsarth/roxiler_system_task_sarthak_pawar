import express from 'express';
import { authorize } from '../middleware/auth.js';
import {
  getDashboard,
  createUser,
  getUsers,
  getUserById,
  createStore,
  getStores
} from '../controllers/adminController.js';

const router = express.Router();

// Middleware to check admin role
router.use(authorize(['ADMIN']));

// Dashboard
router.get('/dashboard', getDashboard);

// Users
router.post('/users', createUser);
router.get('/users', getUsers);
router.get('/users/:id', getUserById);

// Stores
router.post('/stores', createStore);
router.get('/stores', getStores);

export default router;
