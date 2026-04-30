'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useRef } from 'react';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';

export function RecentlyViewed() {
  const { recentlyViewed, removeProduct, isLoaded } = useRecentlyViewed();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  // Don't render until loaded or if empty
  if (!isLoaded || recentlyViewed.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-[#f9f9f9]">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-serif">Recently Viewed</h2>
          <div className="flex gap-2">
            <button
              onClick={() => scroll('left')}
              className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-white transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {recentlyViewed.map((product, idx) => (
            <motion.div
              key={product.id}
              className="flex-shrink-0 w-48 group relative"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Link href={`/product/${product.id}`}>
                <div className="relative aspect-square bg-white rounded-xl mb-3 overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                  />
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      removeProduct(product.id);
                    }}
                    className="absolute top-2 right-2 w-6 h-6 bg-white/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
                <h3 className="text-sm font-medium truncate">{product.name}</h3>
                <p className="text-sm text-gray-500">₹{product.price.toLocaleString()}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
