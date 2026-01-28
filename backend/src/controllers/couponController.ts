import { Request, Response } from 'express';
import prisma from '../lib/prisma';

// Validate coupon
export const validateCoupon = async (req: Request, res: Response) => {
  try {
    const { code, cartTotal } = req.body;

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon) {
      return res.status(404).json({ error: 'Invalid coupon code' });
    }

    if (!coupon.isActive) {
      return res.status(400).json({ error: 'Coupon is no longer active' });
    }

    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return res.status(400).json({ error: 'Coupon has expired' });
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ error: 'Coupon usage limit reached' });
    }

    if (coupon.minPurchase && cartTotal < coupon.minPurchase) {
      return res.status(400).json({
        error: `Minimum purchase of ₹${coupon.minPurchase} required`,
      });
    }

    // Calculate discount
    let discount = 0;
    if (coupon.discountType === 'PERCENTAGE') {
      discount = (cartTotal * coupon.discountValue) / 100;
      if (coupon.maxDiscount) {
        discount = Math.min(discount, coupon.maxDiscount);
      }
    } else {
      discount = coupon.discountValue;
    }

    res.json({
      valid: true,
      discount,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      code: coupon.code,
    });
  } catch (error) {
    console.error('Validate coupon error:', error);
    res.status(500).json({ error: 'Failed to validate coupon' });
  }
};

// Apply coupon (increment usage)
export const applyCoupon = async (req: Request, res: Response) => {
  try {
    const { code } = req.body;

    await prisma.coupon.update({
      where: { code: code.toUpperCase() },
      data: { usedCount: { increment: 1 } },
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Apply coupon error:', error);
    res.status(500).json({ error: 'Failed to apply coupon' });
  }
};

// Admin: Get all coupons
export const getAllCoupons = async (req: Request, res: Response) => {
  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(coupons);
  } catch (error) {
    console.error('Get coupons error:', error);
    res.status(500).json({ error: 'Failed to fetch coupons' });
  }
};

// Admin: Create coupon
export const createCoupon = async (req: Request, res: Response) => {
  try {
    const {
      code,
      discountType,
      discountValue,
      minPurchase,
      maxDiscount,
      usageLimit,
      expiresAt,
    } = req.body;

    const coupon = await prisma.coupon.create({
      data: {
        code: code.toUpperCase(),
        discountType,
        discountValue,
        minPurchase,
        maxDiscount,
        usageLimit,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    });

    res.status(201).json(coupon);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Coupon code already exists' });
    }
    console.error('Create coupon error:', error);
    res.status(500).json({ error: 'Failed to create coupon' });
  }
};

// Admin: Update coupon
export const updateCoupon = async (req: Request, res: Response) => {
  try {
    const couponId = parseInt(req.params.id as string);
    const updateData = req.body;

    if (updateData.expiresAt) {
      updateData.expiresAt = new Date(updateData.expiresAt);
    }

    const coupon = await prisma.coupon.update({
      where: { id: couponId },
      data: updateData,
    });

    res.json(coupon);
  } catch (error) {
    console.error('Update coupon error:', error);
    res.status(500).json({ error: 'Failed to update coupon' });
  }
};

// Admin: Delete coupon
export const deleteCoupon = async (req: Request, res: Response) => {
  try {
    const couponId = parseInt(req.params.id as string);
    await prisma.coupon.delete({ where: { id: couponId } });
    res.json({ message: 'Coupon deleted' });
  } catch (error) {
    console.error('Delete coupon error:', error);
    res.status(500).json({ error: 'Failed to delete coupon' });
  }
};
