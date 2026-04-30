'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, Trash2, ShoppingBag } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { motion } from 'framer-motion';

interface WishlistItem {
  id: number;
  product: {
    id: number;
    name: string;
    price: number;
    image: string;
  };
}

export default function WishlistPage() {
  const { token } = useAuth();
  const { addToCart } = useCart();
  const router = useRouter();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }

    fetch('http://localhost:4000/api/wishlist', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setItems(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [token, router]);

  const handleRemove = async (productId: number) => {
    await fetch(`http://localhost:4000/api/wishlist/${productId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    setItems(items.filter(i => i.product.id !== productId));
  };

  const handleAddToCart = async (productId: number) => {
    await addToCart(productId);
    handleRemove(productId);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center py-24">
        <Heart className="w-16 h-16 text-gray-300 mb-4" />
        <h1 className="text-2xl font-serif mb-4">Your wishlist is empty</h1>
        <Link href="/shop" className="text-[#5a7c65] underline">
          Start shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-serif mb-12">My Wishlist ({items.length} items)</h1>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="group bg-white rounded-xl overflow-hidden shadow-sm"
            >
              <Link href={`/product/${item.product.id}`} className="block">
                <div className="relative aspect-square bg-gradient-to-br from-[#f8f8f5] to-[#f0f0eb]">
                  <Image
                    src={item.product.image}
                    alt={item.product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </Link>
              <div className="p-4">
                <h3 className="font-medium truncate">{item.product.name}</h3>
                <p className="text-[#5a7c65] font-semibold">₹{item.product.price.toLocaleString()}</p>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleAddToCart(item.product.id)}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#5a7c65] text-white py-2 rounded-lg text-sm hover:bg-[#4a6652] transition-colors"
                  >
                    <ShoppingBag className="w-4 h-4" /> Add to Cart
                  </button>
                  <button
                    onClick={() => handleRemove(item.product.id)}
                    className="p-2 border rounded-lg hover:bg-red-50 hover:border-red-200 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
