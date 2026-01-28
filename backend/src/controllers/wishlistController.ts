import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middlewares/authMiddleware';

const prisma = new PrismaClient();

export const getWishlist = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const items = await prisma.wishlistItem.findMany({
      where: { userId },
      include: { product: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get wishlist' });
  }
};

export const addToWishlist = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { productId } = req.body;

    const existing = await prisma.wishlistItem.findUnique({
      where: { userId_productId: { userId, productId } }
    });

    if (existing) {
      return res.status(400).json({ error: 'Already in wishlist' });
    }

    const item = await prisma.wishlistItem.create({
      data: { userId, productId },
      include: { product: true }
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add to wishlist' });
  }
};

export const removeFromWishlist = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const productId = parseInt(req.params.productId as string);

    await prisma.wishlistItem.delete({
      where: { userId_productId: { userId, productId } }
    });

    res.json({ message: 'Removed from wishlist' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove from wishlist' });
  }
};

export const checkWishlist = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const productId = parseInt(req.params.productId as string);

    const item = await prisma.wishlistItem.findUnique({
      where: { userId_productId: { userId, productId } }
    });

    res.json({ inWishlist: !!item });
  } catch (error) {
    res.status(500).json({ error: 'Failed to check wishlist' });
  }
};
