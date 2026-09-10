import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import userRoutes from './routes/user.js';
import storeOwnerRoutes from './routes/storeOwner.js';
import { authenticate } from './middleware/auth.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', authenticate, adminRoutes);
app.use('/api/user', authenticate, userRoutes);
app.use('/api/store-owner', authenticate, storeOwnerRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
