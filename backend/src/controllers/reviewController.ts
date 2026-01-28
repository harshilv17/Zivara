import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middlewares/authMiddleware';

const prisma = new PrismaClient();

export const getProductReviews = async (req: Request, res: Response) => {
  try {
    const productId = parseInt(req.params.productId as string);
    const reviews = await prisma.review.findMany({
      where: { productId },
      include: { user: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' }
    });

    // Calculate average rating
    const avgRating = reviews.length > 0 
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
      : 0;

    res.json({ reviews, avgRating, count: reviews.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get reviews' });
  }
};

export const createReview = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const productId = parseInt(req.params.productId as string);
    const { rating, comment } = req.body;

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be 1-5' });
    }

    // Check if user already reviewed
    const existing = await prisma.review.findFirst({
      where: { userId, productId }
    });

    if (existing) {
      // Update existing review
      const review = await prisma.review.update({
        where: { id: existing.id },
        data: { rating, comment },
        include: { user: { select: { id: true, name: true } } }
      });
      return res.json(review);
    }

    const review = await prisma.review.create({
      data: { userId, productId, rating, comment },
      include: { user: { select: { id: true, name: true } } }
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create review' });
  }
};

export const deleteReview = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const reviewId = parseInt(req.params.reviewId as string);

    const review = await prisma.review.findUnique({ where: { id: reviewId } });

    if (!review || review.userId !== userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await prisma.review.delete({ where: { id: reviewId } });
    res.json({ message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete review' });
  }
};
