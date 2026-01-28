import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middlewares/authMiddleware';

const prisma = new PrismaClient();

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { name, phone, address, city, pincode } = req.body;

    const user = await prisma.user.update({
      where: { id: userId },
      data: { name, phone, address, city, pincode },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        address: true,
        city: true,
        pincode: true
      }
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
};
