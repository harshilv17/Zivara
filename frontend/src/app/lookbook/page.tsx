'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Play, Pause, Volume2, VolumeX, ShoppingBag } from 'lucide-react';
import { RevealOnScroll, TextReveal } from '@/components/ui/AdvancedEffects';

export default function LookbookPage() {
  const [activeImage, setActiveImage] = useState<number | null>(null);

  // Curated lookbook images
  const looks = [
    {
      id: 1,
      image: '/images/hero.png',
      title: 'City Chic',
      description: 'The perfect tote for urban adventures',
      products: ['Classic Tote', 'Mini Wallet'],
    },
    {
      id: 2,
      image: '/images/tote.png',
      title: 'Weekend Vibes',
      description: 'Casual elegance for relaxed days',
      products: ['Crossbody Sling', 'Card Holder'],
    },
    {
      id: 3,
      image: '/images/sling.png',
      title: 'Evening Elegance',
      description: 'Statement pieces for special occasions',
      products: ['Clutch Bag', 'Chain Wallet'],
    },
    {
      id: 4,
      image: '/images/tote.png',
      title: 'Travel Ready',
      description: 'Functional style for globetrotters',
      products: ['Large Tote', 'Passport Wallet'],
    },
    {
      id: 5,
      image: '/images/sling.png',
      title: 'Minimalist',
      description: 'Less is more with timeless designs',
      products: ['Slim Sling', 'Coin Purse'],
    },
    {
      id: 6,
      image: '/images/hero.png',
      title: 'Bold & Beautiful',
      description: 'Make a statement with every step',
      products: ['Oversized Tote', 'Chain Bag'],
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative h-[60vh] bg-[#f8f8f5] flex items-center justify-center overflow-hidden">
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            background: 'radial-gradient(circle at 30% 50%, #5a7c65 0%, transparent 50%), radial-gradient(circle at 70% 50%, #d4a373 0%, transparent 50%)',
          }}
        />
        <div className="relative z-10 text-center px-4">
          <motion.span
            className="text-[#5a7c65] text-sm tracking-widest uppercase font-medium"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Zivara Lookbook
          </motion.span>
          <motion.h1
            className="text-5xl md:text-7xl font-serif mt-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Style Stories
          </motion.h1>
          <motion.p
            className="text-gray-500 mt-4 max-w-md mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Explore our curated collections and find your perfect match
          </motion.p>
        </div>
      </section>

      {/* Masonry Grid */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {looks.map((look, idx) => (
              <motion.div
                key={look.id}
                className="break-inside-avoid group cursor-pointer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => setActiveImage(activeImage === look.id ? null : look.id)}
              >
                <div className="relative overflow-hidden rounded-2xl bg-[#f8f8f5]">
                  <motion.div
                    className={`aspect-[3/4] relative`}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Image
                      src={look.image}
                      alt={look.title}
                      fill
                      className="object-cover"
                    />
                    
                    {/* Overlay */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <h3 className="text-2xl font-serif mb-2">{look.title}</h3>
                        <p className="text-white/80 text-sm mb-4">{look.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {look.products.map((product) => (
                            <span
                              key={product}
                              className="text-xs bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full"
                            >
                              {product}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Shop the Look CTA */}
      <section className="py-24 bg-gradient-to-br from-[#5a7c65] to-[#4a6652] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-serif mb-4">Shop the Look</h2>
          <p className="text-white/80 mb-8 max-w-md mx-auto">
            Find the perfect pieces to recreate these stunning styles
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-white text-[#5a7c65] px-8 py-4 rounded-full font-medium hover:bg-gray-100 transition-colors"
          >
            <ShoppingBag className="w-5 h-5" />
            Browse Collection
          </Link>
        </div>
      </section>
    </div>
  );
}
