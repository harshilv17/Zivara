import { Request, Response } from 'express';
import prisma from '../lib/prisma';

// Get all addresses for user
export const getAddresses = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: { isDefault: 'desc' },
    });
    res.json(addresses);
  } catch (error) {
    console.error('Get addresses error:', error);
    res.status(500).json({ error: 'Failed to fetch addresses' });
  }
};

// Create new address
export const createAddress = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { name, phone, address, city, pincode, isDefault } = req.body;

    // If setting as default, unset other defaults
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    const newAddress = await prisma.address.create({
      data: {
        userId,
        name,
        phone,
        address,
        city,
        pincode,
        isDefault: isDefault || false,
      },
    });

    res.status(201).json(newAddress);
  } catch (error) {
    console.error('Create address error:', error);
    res.status(500).json({ error: 'Failed to create address' });
  }
};

// Update address
export const updateAddress = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const addressId = parseInt(req.params.id as string);
    const { name, phone, address, city, pincode, isDefault } = req.body;

    // Verify ownership
    const existing = await prisma.address.findFirst({
      where: { id: addressId, userId },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Address not found' });
    }

    // If setting as default, unset other defaults
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId, NOT: { id: addressId } },
        data: { isDefault: false },
      });
    }

    const updated = await prisma.address.update({
      where: { id: addressId },
      data: { name, phone, address, city, pincode, isDefault },
    });

    res.json(updated);
  } catch (error) {
    console.error('Update address error:', error);
    res.status(500).json({ error: 'Failed to update address' });
  }
};

// Delete address
export const deleteAddress = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const addressId = parseInt(req.params.id as string);

    // Verify ownership
    const existing = await prisma.address.findFirst({
      where: { id: addressId, userId },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Address not found' });
    }

    await prisma.address.delete({ where: { id: addressId } });
    res.json({ message: 'Address deleted' });
  } catch (error) {
    console.error('Delete address error:', error);
    res.status(500).json({ error: 'Failed to delete address' });
  }
};

// Set default address
export const setDefaultAddress = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const addressId = parseInt(req.params.id as string);

    // Verify ownership
    const existing = await prisma.address.findFirst({
      where: { id: addressId, userId },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Address not found' });
    }

    // Unset all defaults
    await prisma.address.updateMany({
      where: { userId },
      data: { isDefault: false },
    });

    // Set new default
    const updated = await prisma.address.update({
      where: { id: addressId },
      data: { isDefault: true },
    });

    res.json(updated);
  } catch (error) {
    console.error('Set default address error:', error);
    res.status(500).json({ error: 'Failed to set default address' });
  }
};
