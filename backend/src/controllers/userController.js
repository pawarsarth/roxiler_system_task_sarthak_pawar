import prisma from '../config/db.js';
import { validateRating } from '../utils/validation.js';

// Get all stores
export const getStores = async (req, res) => {
  try {
    const { search, sort, order } = req.query;
    const sortField = sort || 'name';
    const sortOrder = order === 'desc' ? 'desc' : 'asc';
    const userId = req.user.id;

    let where = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } }
      ];
    }

    const stores = await prisma.store.findMany({
      where,
      include: {
        ratings: {
          select: {
            score: true,
            userId: true
          }
        }
      },
      orderBy: { [sortField]: sortOrder }
    });

    const storesWithRating = stores.map((store) => {
      const allRatings = store.ratings.map(r => r.score);
      const userRating = store.ratings.find(r => r.userId === userId)?.score || null;
      const avgRating = allRatings.length > 0
        ? (allRatings.reduce((sum, r) => sum + r, 0) / allRatings.length).toFixed(1)
        : null;

      return {
        id: store.id,
        name: store.name,
        address: store.address,
        overallRating: avgRating,
        userRating,
        ratingCount: allRatings.length
      };
    });

    res.json(storesWithRating);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch stores' });
  }
};

// Submit or update rating
export const submitRating = async (req, res) => {
  try {
    const { storeId, score } = req.body;
    const userId = req.user.id;

    if (!storeId || score === undefined) {
      return res.status(400).json({ error: 'Store ID and score are required' });
    }

    if (!validateRating(score)) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    // Check if store exists
    const store = await prisma.store.findUnique({
      where: { id: storeId }
    });

    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    // Check if rating exists
    const existingRating = await prisma.rating.findUnique({
      where: {
        userId_storeId: {
          userId,
          storeId
        }
      }
    });

    let rating;
    if (existingRating) {
      // Update
      rating = await prisma.rating.update({
        where: { id: existingRating.id },
        data: { score: parseInt(score) }
      });
    } else {
      // Create
      rating = await prisma.rating.create({
        data: {
          score: parseInt(score),
          userId,
          storeId
        }
      });
    }

    res.json({
      message: existingRating ? 'Rating updated successfully' : 'Rating submitted successfully',
      rating
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to submit rating' });
  }
};

// Get user's rating for a store
export const getUserRating = async (req, res) => {
  try {
    const { storeId } = req.params;
    const userId = req.user.id;

    const rating = await prisma.rating.findUnique({
      where: {
        userId_storeId: {
          userId,
          storeId
        }
      }
    });

    if (!rating) {
      return res.json({ rating: null });
    }

    res.json({ rating: rating.score });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch rating' });
  }
};
