import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middlewares/authMiddleware';

const prisma = new PrismaClient();

export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { shippingName, shippingPhone, shippingAddress, shippingCity, shippingPincode, paymentMethod = 'UPI' } = req.body;

    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } }
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const total = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    const order = await prisma.order.create({
      data: {
        userId,
        total,
        paymentMethod,
        paymentStatus: 'PENDING',
        shippingName,
        shippingPhone,
        shippingAddress,
        shippingCity,
        shippingPincode,
        items: {
          create: cart.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price
          }))
        }
      },
      include: { items: { include: { product: true } } }
    });

    // Clear cart after order
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

export const updatePaymentStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { paymentStatus } = req.body;

    const order = await prisma.order.findFirst({
      where: { id: Number(id), userId: req.userId }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const updated = await prisma.order.update({
      where: { id: Number(id) },
      data: { 
        paymentStatus,
        status: paymentStatus === 'COMPLETED' ? 'PROCESSING' : order.status
      }
    });

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update payment status' });
  }
};

export const getOrders = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;

    const orders = await prisma.order.findMany({
      where: { userId },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' }
    });

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get orders' });
  }
};

export const getOrder = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    const order = await prisma.order.findFirst({
      where: { id: Number(id), userId },
      include: { items: { include: { product: true } } }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get order' });
  }
};

// Admin: Get all orders
export const getAllOrders = async (req: AuthRequest, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      include: { items: { include: { product: true } }, user: { select: { id: true, email: true, name: true } } },
      orderBy: { createdAt: 'desc' }
    });

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get orders' });
  }
};

// Admin: Update order status
export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await prisma.order.update({
      where: { id: Number(id) },
      data: { status }
    });

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update order' });
  }
};
