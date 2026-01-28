import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { search, category, sort, minPrice, maxPrice } = req.query;
    
    // Build where clause
    const where: any = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search as string } },
        { description: { contains: search as string } }
      ];
    }
    
    if (category && category !== 'all') {
      where.category = category as string;
    }
    
    if (minPrice) {
      where.price = { ...where.price, gte: parseFloat(minPrice as string) };
    }
    
    if (maxPrice) {
      where.price = { ...where.price, lte: parseFloat(maxPrice as string) };
    }
    
    // Build orderBy
    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'price_asc') orderBy = { price: 'asc' };
    if (sort === 'price_desc') orderBy = { price: 'desc' };
    if (sort === 'name_asc') orderBy = { name: 'asc' };
    if (sort === 'newest') orderBy = { createdAt: 'desc' };
    
    const products = await prisma.product.findMany({
      where,
      orderBy
    });
    
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

export const getProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id as string) }
    });
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, price, image, category } = req.body;
    const product = await prisma.product.create({
      data: { name, description, price, image, category }
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product' });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, price, image, category, inStock } = req.body;
    
    const product = await prisma.product.update({
      where: { id: parseInt(id as string) },
      data: { name, description, price, image, category, inStock }
    });
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product' });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({ where: { id: parseInt(id as string) } });
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
};

export const getCategories = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      select: { category: true },
      distinct: ['category']
    });
    const categories = products.map(p => p.category);
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

export const seedProducts = async (req: Request, res: Response) => {
    try {
        // Clear related tables first to avoid foreign key constraints
        await prisma.cartItem.deleteMany();
        await prisma.wishlistItem.deleteMany();
        await prisma.review.deleteMany();
        await prisma.orderItem.deleteMany();
        await prisma.product.deleteMany();
        
        const products = [
            { name: 'SWING Matcha', price: 2499, image: '/images/sling.png', category: 'Sling', description: 'A perfect pastel green sling for your daily essentials.' },
            { name: 'SWING Terra', price: 2899, image: '/images/tote.png', category: 'Tote', description: 'Earthy tan tote bag with ample space.' },
            { name: 'SWING Rocher', price: 2499, image: '/images/sling.png', category: 'Sling', description: 'Classic brown sling.' },
            { name: 'SWING Sienna', price: 3299, image: '/images/tote.png', category: 'Tote', description: 'Premium tote for work and travel.' },
            { name: 'SWING Pearl', price: 2799, image: '/images/sling.png', category: 'Sling', description: 'Elegant white sling bag.' },
            { name: 'CARRY All', price: 3499, image: '/images/tote.png', category: 'Tote', description: 'The everyday carry-all tote.' },
            { name: 'MINI Pouch', price: 1499, image: '/images/sling.png', category: 'Wallet', description: 'Compact mini pouch wallet.' },
            { name: 'EVENING Clutch', price: 1999, image: '/images/tote.png', category: 'Wallet', description: 'Stylish evening clutch.' },
        ];

        for (const p of products) {
            await prisma.product.create({ data: p });
        }
        res.json({ message: 'Seeded successfully', count: products.length });
    } catch (error) {
        console.error('Seeding error:', error);
        res.status(500).json({ error: 'Seeding failed' });
    }
}
