'use client';

import Link from 'next/link';
import { Instagram, Facebook, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const iconVariants = {
  hover: { 
    scale: 1.2, 
    rotate: 5,
    transition: { type: "spring" as const, stiffness: 400, damping: 10 }
  }
};

export function Footer() {
  return (
    <motion.footer 
      className="bg-[#f9f9f9] border-t border-gray-100 pt-16 pb-8"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Brand Column */}
          <motion.div variants={itemVariants} className="space-y-4">
            <motion.h3 
              className="text-2xl font-serif font-bold text-gradient"
              whileHover={{ scale: 1.02 }}
            >
              ZIVARA
            </motion.h3>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              Born from a little madness, held together by craft, and fueled by feeling. Thoughtfully designed handbags for the modern woman.
            </p>
            <div className="flex gap-4 pt-2">
              <motion.a 
                href="#" 
                className="text-gray-400 hover:text-[#5a7c65] transition-colors p-2 rounded-full hover:bg-[#5a7c65]/10"
                variants={iconVariants}
                whileHover="hover"
                whileTap={{ scale: 0.9 }}
              >
                <Instagram className="w-5 h-5" />
              </motion.a>
              <motion.a 
                href="#" 
                className="text-gray-400 hover:text-[#5a7c65] transition-colors p-2 rounded-full hover:bg-[#5a7c65]/10"
                variants={iconVariants}
                whileHover="hover"
                whileTap={{ scale: 0.9 }}
              >
                <Facebook className="w-5 h-5" />
              </motion.a>
              <motion.a 
                href="mailto:hello@wearzivara.com" 
                className="text-gray-400 hover:text-[#5a7c65] transition-colors p-2 rounded-full hover:bg-[#5a7c65]/10"
                variants={iconVariants}
                whileHover="hover"
                whileTap={{ scale: 0.9 }}
              >
                <Mail className="w-5 h-5" />
              </motion.a>
            </div>
          </motion.div>

          {/* Shop Column */}
          <motion.div variants={itemVariants}>
            <h4 className="font-semibold mb-6 tracking-wide text-sm uppercase">Shop</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              {[
                { href: '/shop', label: 'All Products' },
                { href: '/collections/totes', label: 'Totes' },
                { href: '/collections/slings', label: 'Slings' },
                { href: '/collections/wallets', label: 'Wallets' }
              ].map((item) => (
                <motion.li 
                  key={item.href}
                  whileHover={{ x: 4 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                  <Link href={item.href} className="hover:text-[#5a7c65] transition-colors link-underline">
                    {item.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Help Column */}
          <motion.div variants={itemVariants}>
            <h4 className="font-semibold mb-6 tracking-wide text-sm uppercase">Help</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              {[
                { href: '/shipping', label: 'Shipping & Delivery' },
                { href: '/returns', label: 'Returns & Exchange' },
                { href: '/contact', label: 'Contact Us' },
                { href: '/privacy', label: 'Privacy Policy' }
              ].map((item) => (
                <motion.li 
                  key={item.href}
                  whileHover={{ x: 4 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                  <Link href={item.href} className="hover:text-[#5a7c65] transition-colors link-underline">
                    {item.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Newsletter Column */}
          <motion.div variants={itemVariants}>
            <h4 className="font-semibold mb-6 tracking-wide text-sm uppercase">Stay in the loop</h4>
            <p className="text-gray-500 text-sm mb-4">Subscribe to receive updates, access to exclusive deals, and more.</p>
            <form className="flex gap-2">
              <motion.input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 px-4 py-2 border border-gray-200 focus:outline-none focus:border-[#5a7c65] text-sm rounded-sm bg-white input-glow"
                whileFocus={{ scale: 1.01 }}
              />
              <motion.button 
                className="bg-[#5a7c65] text-white px-4 py-2 text-sm font-medium hover:bg-[#4a6652] transition-colors rounded-sm relative overflow-hidden group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10">JOIN</span>
                <motion.span 
                  className="absolute inset-0 bg-[#4a6652]"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            </form>
          </motion.div>
        </motion.div>

        <motion.div 
          className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <p>© {new Date().getFullYear()} Zivara. All rights reserved.</p>
          <motion.div 
            className="flex gap-4"
            whileHover={{ scale: 1.02 }}
          >
            <span>By Harshil Valecha (Clone)</span>
          </motion.div>
        </motion.div>
      </div>
    </motion.footer>
  );
}

