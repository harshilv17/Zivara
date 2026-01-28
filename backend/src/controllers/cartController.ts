import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middlewares/authMiddleware';

const prisma = new PrismaClient();

export const getCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;

    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: { product: true }
        }
      }
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
        include: { items: { include: { product: true } } }
      });
    }

    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get cart' });
  }
};

export const addToCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    let cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      cart = await prisma.cart.create({ data: { userId } });
    }

    const existingItem = await prisma.cartItem.findUnique({
      where: { cartId_productId: { cartId: cart.id, productId } }
    });

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity }
      });
    } else {
      await prisma.cartItem.create({
        data: { cartId: cart.id, productId, quantity }
      });
    }

    const updatedCart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } }
    });

    res.json(updatedCart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add to cart' });
  }
};

export const updateCartItem = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { itemId } = req.params;
    const { quantity } = req.body;

    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const item = await prisma.cartItem.findFirst({
      where: { id: Number(itemId), cartId: cart.id }
    });

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    if (quantity <= 0) {
      await prisma.cartItem.delete({ where: { id: item.id } });
    } else {
      await prisma.cartItem.update({
        where: { id: item.id },
        data: { quantity }
      });
    }

    const updatedCart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } }
    });

    res.json(updatedCart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update cart' });
  }
};

export const removeFromCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { itemId } = req.params;

    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    await prisma.cartItem.deleteMany({
      where: { id: Number(itemId), cartId: cart.id }
    });

    const updatedCart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } }
    });

    res.json(updatedCart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to remove from cart' });
  }
};

export const clearCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;

    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (cart) {
      await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    }

    res.json({ message: 'Cart cleared' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
};
