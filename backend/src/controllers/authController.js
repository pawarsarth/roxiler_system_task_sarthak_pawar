import bcryptjs from 'bcryptjs';
import prisma from '../config/db.js';
import { generateToken } from '../middleware/auth.js';
import { validateEmail, validatePassword, validateName, validateAddress } from '../utils/validation.js';

export const signup = async (req, res) => {
  try {
    const { email, password, name, address } = req.body;

    // Validation
    if (!email || !password || !name || !address) {
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

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        address,
        role: 'NORMAL_USER'
      }
    });

    const token = generateToken(user);

    res.status(201).json({
      message: 'Signup successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Signup failed' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user);

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Login failed' });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Both passwords are required' });
    }

    if (!validatePassword(newPassword)) {
      return res.status(400).json({ error: 'Password must be 8-16 chars with uppercase and special character' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    const isPasswordValid = await bcryptjs.compare(currentPassword, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    const hashedPassword = await bcryptjs.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Update failed' });
  }
};
