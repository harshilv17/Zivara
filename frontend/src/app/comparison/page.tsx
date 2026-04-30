'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, X, ShoppingBag, Check } from 'lucide-react';
import { useCompare } from '@/contexts/CompareContext';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';

export default function ComparisonPage() {
  const { compareList, removeFromCompare, clearCompare } = useCompare();
  const { addToCart } = useCart();
  const [addedIds, setAddedIds] = useState<number[]>([]);

  const handleAddToCart = async (productId: number) => {
    await addToCart(productId, 1);
    setAddedIds((prev) => [...prev, productId]);
    setTimeout(() => {
      setAddedIds((prev) => prev.filter((id) => id !== productId));
    }, 2000);
  };

  if (compareList.length === 0) {
    return (
      <div className="min-h-screen bg-[#f9f9f9] py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-serif mb-4">Compare Products</h1>
          <p className="text-gray-500 mb-8">You haven&apos;t added any products to compare yet.</p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-[#5a7c65] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#4a6652] transition-colors"
          >
            <ShoppingBag className="w-5 h-5" />
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  // Product type for comparison
  type ProductKey = 'price' | 'category' | 'inStock';
  
  interface CompareProduct {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    inStock: boolean;
  }

  // Comparison attributes
  const attributes: Array<{ key: ProductKey; label: string; format: (v: number | string | boolean) => string }> = [
    { key: 'price', label: 'Price', format: (v) => `₹${(v as number).toLocaleString()}` },
    { key: 'category', label: 'Category', format: (v) => v as string },
    { key: 'inStock', label: 'Availability', format: (v) => (v ? 'In Stock' : 'Out of Stock') },
  ];

  const getValue = (product: CompareProduct, key: ProductKey): number | string | boolean => {
    return product[key];
  };

  return (
    <div className="min-h-screen bg-[#f9f9f9] py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/shop"
              className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-serif">Compare Products</h1>
          </div>
          <button
            onClick={clearCompare}
            className="text-sm text-gray-500 hover:text-red-500 transition-colors"
          >
            Clear All
          </button>
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="p-6 text-left font-medium text-gray-500 w-40">Product</th>
                  {compareList.map((product) => (
                    <th key={product.id} className="p-6 min-w-[250px]">
                      <motion.div
                        className="relative"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <button
                          onClick={() => removeFromCompare(product.id)}
                          className="absolute -top-2 -right-2 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <Link href={`/product/${product.id}`}>
                          <div className="relative aspect-square bg-[#f8f8f5] rounded-xl mb-4 overflow-hidden">
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-contain p-4"
                            />
                          </div>
                          <h3 className="font-medium text-lg">{product.name}</h3>
                        </Link>
                      </motion.div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {attributes.map((attr, idx) => (
                  <tr key={attr.key} className={idx % 2 === 0 ? 'bg-gray-50' : ''}>
                    <td className="p-6 font-medium text-gray-500">{attr.label}</td>
                    {compareList.map((product) => (
                      <td key={product.id} className="p-6 text-center">
                        <span
                          className={
                            attr.key === 'inStock'
                              ? getValue(product as CompareProduct, attr.key)
                                ? 'text-green-600'
                                : 'text-red-500'
                              : ''
                          }
                        >
                          {attr.format(getValue(product as CompareProduct, attr.key))}
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
                {/* Description row */}
                <tr className="bg-gray-50">
                  <td className="p-6 font-medium text-gray-500">Description</td>
                  {compareList.map((product) => (
                    <td key={product.id} className="p-6 text-center text-sm text-gray-600">
                      <p className="line-clamp-3">{product.description}</p>
                    </td>
                  ))}
                </tr>
                {/* Add to Cart row */}
                <tr>
                  <td className="p-6"></td>
                  {compareList.map((product) => (
                    <td key={product.id} className="p-6">
                      <motion.button
                        onClick={() => handleAddToCart(product.id)}
                        disabled={!product.inStock || addedIds.includes(product.id)}
                        className={`w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors ${
                          addedIds.includes(product.id)
                            ? 'bg-green-500 text-white'
                            : product.inStock
                            ? 'bg-[#5a7c65] text-white hover:bg-[#4a6652]'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                        whileTap={{ scale: 0.98 }}
                      >
                        {addedIds.includes(product.id) ? (
                          <>
                            <Check className="w-5 h-5" />
                            Added
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-5 h-5" />
                            Add to Cart
                          </>
                        )}
                      </motion.button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Add more products hint */}
        {compareList.length < 4 && (
          <div className="mt-8 text-center">
            <p className="text-gray-500 mb-4">
              You can compare up to 4 products. Add {4 - compareList.length} more to compare.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-[#5a7c65] font-medium hover:underline"
            >
              Browse more products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
