'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

export function Hero() {
  const textVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.15,
        duration: 0.8,
        ease: "easeOut" as const,
      },
    }),
  };

  return (
    <section className="relative w-full h-[85vh] overflow-hidden">
      <motion.div
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute inset-0"
      >
        <Image
          src="/images/hero.png"
          alt="Zivara Lifestyle"
          fill
          className="object-cover"
          priority
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30" />
      
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
        <div className="text-white space-y-6">
          <motion.span 
            custom={0}
            variants={textVariants}
            initial="hidden"
            animate="visible"
            className="block text-sm md:text-base tracking-[0.3em] font-medium uppercase"
          >
            Crafted for Everyday Style
          </motion.span>
          <motion.h1 
            custom={1}
            variants={textVariants}
            initial="hidden"
            animate="visible"
            className="text-5xl md:text-7xl lg:text-8xl font-serif font-medium tracking-tight"
          >
            <span className="inline-block">Pour the </span>
            <motion.span 
              className="inline-block italic"
              whileHover={{ 
                scale: 1.05,
                color: '#d4a373',
                transition: { duration: 0.3 }
              }}
            >
              Playful
            </motion.span>
          </motion.h1>
          <motion.div 
            custom={2}
            variants={textVariants}
            initial="hidden"
            animate="visible"
            className="pt-8"
          >
            <Link href="/shop">
              <motion.span 
                className="inline-block px-10 py-4 bg-white text-gray-900 font-medium text-sm tracking-widest rounded-sm relative overflow-hidden group"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10 group-hover:text-white transition-colors duration-300">SHOP NOW</span>
                <motion.span 
                  className="absolute inset-0 bg-[#5a7c65] origin-left"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />
              </motion.span>
            </Link>
          </motion.div>
        </div>
      </div>
      
      {/* Enhanced Scroll indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
      >
        <motion.div 
          className="flex flex-col items-center gap-2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-white/60 text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-white/60 via-white to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  );
}

