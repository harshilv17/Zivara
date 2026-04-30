'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { RevealOnScroll, AnimatedCounter, TextReveal } from './ui/AdvancedEffects';
import { Sparkles, Users, ShoppingBag, Award } from 'lucide-react';

const stats = [
  { value: 5000, suffix: '+', label: 'Happy Customers', icon: Users },
  { value: 150, suffix: '+', label: 'Products Sold', icon: ShoppingBag },
  { value: 4.9, prefix: '', suffix: '', label: 'Star Rating', icon: Award },
  { value: 100, suffix: '%', label: 'Cruelty Free', icon: Sparkles },
];

export function StatsSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-[#5a7c65] via-[#4a6652] to-[#3a5642]">
      <div className="container mx-auto px-4">
        <RevealOnScroll animation="fadeUp" className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">
            <TextReveal text="Numbers That Speak" />
          </h2>
          <p className="text-white/70 max-w-lg mx-auto">
            Join thousands of happy customers who trust Zivara for their everyday style.
          </p>
        </RevealOnScroll>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <RevealOnScroll 
              key={idx} 
              animation="scale" 
              delay={idx * 0.1}
              className="text-center"
            >
              <motion.div
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
                whileHover={{ y: -5, backgroundColor: 'rgba(255,255,255,0.15)' }}
                transition={{ duration: 0.3 }}
              >
                <stat.icon className="w-8 h-8 text-[#d4a373] mx-auto mb-4" />
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {stat.prefix}
                  <AnimatedCounter target={stat.value} duration={2.5} />
                  {stat.suffix}
                </div>
                <p className="text-white/70 text-sm uppercase tracking-wider">{stat.label}</p>
              </motion.div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}

const collections = [
  { 
    name: 'Totes', 
    image: '/images/tote.png', 
    description: 'Spacious & Elegant',
    href: '/collections/totes'
  },
  { 
    name: 'Slings', 
    image: '/images/sling.png', 
    description: 'Light & Playful',
    href: '/collections/slings'
  },
  { 
    name: 'Wallets', 
    image: '/images/tote.png', 
    description: 'Compact & Chic',
    href: '/collections/wallets'
  },
];

export function CollectionsGrid() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <RevealOnScroll animation="fadeUp" className="text-center mb-16">
          <span className="text-[#5a7c65] text-sm tracking-widest font-medium uppercase">Explore</span>
          <h2 className="text-4xl md:text-5xl font-serif mt-4 text-gray-900">
            Shop by Category
          </h2>
        </RevealOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {collections.map((collection, idx) => (
            <RevealOnScroll 
              key={idx} 
              animation="fadeUp" 
              delay={idx * 0.15}
            >
              <Link href={collection.href}>
                <motion.div
                  className="relative group overflow-hidden rounded-2xl bg-gradient-to-br from-[#f8f8f5] to-[#f0f0eb] aspect-[4/5]"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.4 }}
                >
                  {/* Image with parallax effect */}
                  <motion.div 
                    className="absolute inset-0"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Image
                      src={collection.image}
                      alt={collection.name}
                      fill
                      className="object-contain p-8"
                    />
                  </motion.div>

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      whileHover={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="text-center"
                    >
                      <h3 className="text-2xl font-serif text-white mb-2">{collection.name}</h3>
                      <p className="text-white/80 text-sm">{collection.description}</p>
                    </motion.div>
                  </div>

                  {/* Decorative corner */}
                  <motion.div 
                    className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-[#5a7c65] opacity-0 group-hover:opacity-100"
                    initial={{ scale: 0 }}
                    whileHover={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              </Link>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}

export function InstagramSection() {
  const images = [
    '/images/tote.png',
    '/images/sling.png',
    '/images/tote.png',
    '/images/sling.png',
    '/images/tote.png',
    '/images/sling.png',
  ];

  return (
    <section className="py-24 bg-[#f8f8f5]">
      <div className="container mx-auto px-4">
        <RevealOnScroll animation="fadeUp" className="text-center mb-12">
          <span className="text-[#5a7c65] text-sm tracking-widest font-medium uppercase">
            @wearzivara
          </span>
          <h2 className="text-3xl md:text-4xl font-serif mt-4 text-gray-900">
            Follow Us on Instagram
          </h2>
        </RevealOnScroll>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {images.map((img, idx) => (
            <RevealOnScroll 
              key={idx} 
              animation="scale" 
              delay={idx * 0.05}
            >
              <motion.div
                className="relative aspect-square overflow-hidden bg-white cursor-pointer group"
                whileHover={{ scale: 0.95 }}
              >
                <Image
                  src={img}
                  alt={`Instagram ${idx + 1}`}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-[#5a7c65]/0 group-hover:bg-[#5a7c65]/20 transition-colors duration-300 flex items-center justify-center">
                  <motion.span
                    className="text-white text-2xl opacity-0 group-hover:opacity-100"
                    initial={{ scale: 0 }}
                    whileHover={{ scale: 1 }}
                  >
                    ♥
                  </motion.span>
                </div>
              </motion.div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}

export function NewsletterSection() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Decorative elements */}
      <motion.div 
        className="absolute -top-20 -right-20 w-64 h-64 bg-[#5a7c65]/5 rounded-full"
        animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
        transition={{ duration: 20, repeat: Infinity }}
      />
      <motion.div 
        className="absolute -bottom-20 -left-20 w-48 h-48 bg-[#d4a373]/5 rounded-full"
        animate={{ scale: [1.2, 1, 1.2], rotate: [360, 180, 0] }}
        transition={{ duration: 15, repeat: Infinity }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <RevealOnScroll animation="fadeUp">
          <div className="max-w-2xl mx-auto text-center">
            <span className="text-[#5a7c65] text-sm tracking-widest font-medium uppercase">
              Newsletter
            </span>
            <h2 className="text-3xl md:text-4xl font-serif mt-4 mb-4 text-gray-900">
              Stay in the Loop
            </h2>
            <p className="text-gray-500 mb-8">
              Subscribe to get exclusive access to new collections, styling tips, and special offers.
            </p>
            
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <motion.input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 border border-gray-200 rounded-full focus:outline-none focus:border-[#5a7c65] focus:ring-2 focus:ring-[#5a7c65]/10"
                whileFocus={{ scale: 1.02 }}
              />
              <motion.button
                type="submit"
                className="px-8 py-4 bg-[#5a7c65] text-white rounded-full font-medium hover:bg-[#4a6652] transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Subscribe
              </motion.button>
            </form>
            
            <p className="text-xs text-gray-400 mt-4">
              By subscribing, you agree to our Privacy Policy.
            </p>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
