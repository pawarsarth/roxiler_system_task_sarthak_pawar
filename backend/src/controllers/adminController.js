import bcryptjs from 'bcryptjs';
import prisma from '../config/db.js';
import { validateEmail, validatePassword, validateName, validateAddress } from '../utils/validation.js';

// Dashboard
export const getDashboard = async (req, res) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalStores = await prisma.store.count();
    const totalRatings = await prisma.rating.count();

    res.json({
      totalUsers,
      totalStores,
      totalRatings
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch dashboard' });
  }
};

// Users Management
export const createUser = async (req, res) => {
  try {
    const { email, password, name, address, role } = req.body;

    // Validation
    if (!email || !password || !name || !address || !role) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({ error: 'Password must be 8-16 chars with uppercase and special character' });
    }

    if (!validateName(name)) {
      return res.status(400).json({ error: 'Name must be 2-60 characters' });
    }

    if (!validateAddress(address)) {
      return res.status(400).json({ error: 'Address must be max 400 characters' });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        address,
        role
      }
    });

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        address: user.address,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create user' });
  }
};

export const getUsers = async (req, res) => {
  try {
    const { search, role, sort, order } = req.query;
    const sortField = sort || 'name';
    const sortOrder = order === 'desc' ? 'desc' : 'asc';

    let where = {};
    if (role) where.role = role;

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } }
      ];
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true
      },
      orderBy: { [sortField]: sortOrder }
    });

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        store: {
          select: {
            id: true,
            name: true,
            ratings: {
              select: { score: true }
            }
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Calculate average rating if store owner
    let avgRating = null;
    if (user.store && user.store.ratings.length > 0) {
      avgRating = (user.store.ratings.reduce((sum, r) => sum + r.score, 0) / user.store.ratings.length).toFixed(1);
    }

    res.json({
      ...user,
      rating: avgRating
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

// Stores Management
export const createStore = async (req, res) => {
  try {
    const { name, email, address, ownerId } = req.body;

    if (!name || !email || !address || !ownerId) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    if (!validateAddress(address)) {
      return res.status(400).json({ error: 'Address must be max 400 characters' });
    }

    const existingStore = await prisma.store.findUnique({
      where: { email }
    });

    if (existingStore) {
      return res.status(400).json({ error: 'Store email already exists' });
    }

    const store = await prisma.store.create({
      data: {
        name,
        email,
        address,
        ownerId
      }
    });

    res.status(201).json({
      message: 'Store created successfully',
      store
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create store' });
  }
};

export const getStores = async (req, res) => {
  try {
    const { search, sort, order } = req.query;
    const sortField = sort || 'name';
    const sortOrder = order === 'desc' ? 'desc' : 'asc';

    let where = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } }
      ];
    }

    const stores = await prisma.store.findMany({
      where,
      include: {
        ratings: {
          select: { score: true }
        }
      },
      orderBy: { [sortField]: sortOrder }
    });

    const storesWithRating = stores.map((store) => ({
      ...store,
      rating: store.ratings.length > 0
        ? (store.ratings.reduce((sum, r) => sum + r.score, 0) / store.ratings.length).toFixed(1)
        : null,
      ratings: undefined
    }));

    res.json(storesWithRating);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch stores' });
  }
};
