'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const features = ['Premium Vegan Leather', 'Water Resistant Lining', 'Handcrafted Details'];

export function Features() {
  return (
    <section className="relative w-full py-32 bg-[#f0eee6] overflow-hidden my-12">
      {/* Decorative Elements */}
      <motion.div 
        className="absolute top-20 left-10 w-32 h-32 rounded-full bg-[#5a7c65]/5"
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <motion.div 
        className="absolute bottom-20 right-10 w-48 h-48 rounded-full bg-[#d4a373]/5"
        animate={{ 
          scale: [1.2, 1, 1.2],
          rotate: [360, 180, 0]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      />
      
      <div className="container mx-auto px-4 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div 
          className="order-2 lg:order-1 space-y-8"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <motion.h2 
            className="text-4xl md:text-6xl font-serif leading-tight text-gray-900"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Perfectly <br/>
            <motion.span 
              className="italic text-gradient"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              Balanced
            </motion.span>.
          </motion.h2>
          <motion.p 
            className="text-gray-600 text-lg leading-relaxed max-w-md"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Our bags are designed to be your daily companion. Spacious enough for your essentials, sleek enough for dinner, and durable enough for the journey.
          </motion.p>
          <motion.ul 
            className="space-y-4 pt-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((item, idx) => (
              <motion.li 
                key={item} 
                variants={itemVariants}
                className="flex items-center gap-3 text-sm font-medium tracking-wide text-gray-800 uppercase group cursor-default"
                whileHover={{ x: 8, transition: { duration: 0.2 } }}
              >
                <motion.span 
                  className="w-2 h-2 bg-[#5a7c65] rounded-full"
                  whileHover={{ scale: 1.5 }}
                  animate={{ 
                    scale: [1, 1.2, 1],
                  }}
                  transition={{ 
                    delay: idx * 0.2,
                    duration: 2, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <span className="group-hover:text-[#5a7c65] transition-colors duration-300">{item}</span>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
        <motion.div 
          className="order-1 lg:order-2 relative h-[500px]"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            className="relative h-full w-full"
            whileHover={{ scale: 1.02, rotate: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <Image
              src="/images/tote.png" 
              alt="Feature Bag"
              fill
              className="object-contain drop-shadow-2xl"
            />
          </motion.div>
          {/* Floating badge */}
          <motion.div 
            className="absolute -bottom-4 -right-4 bg-white rounded-full px-6 py-3 shadow-lg"
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
            whileHover={{ scale: 1.05, y: -2 }}
          >
            <span className="text-sm font-medium text-[#5a7c65]">100% Vegan</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

