import prisma from '../config/db.js';

// Get store dashboard
export const getStoreDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    const store = await prisma.store.findUnique({
      where: { ownerId: userId },
      include: {
        ratings: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    const avgRating = store.ratings.length > 0
      ? (store.ratings.reduce((sum, r) => sum + r.score, 0) / store.ratings.length).toFixed(1)
      : null;

    const ratingsList = store.ratings.map((r) => ({
      id: r.id,
      userName: r.user.name,
      userEmail: r.user.email,
      score: r.score,
      createdAt: r.createdAt
    }));

    res.json({
      store: {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address
      },
      averageRating: avgRating,
      totalRatings: store.ratings.length,
      ratings: ratingsList
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch store dashboard' });
  }
};
