'use client';

import { motion } from 'framer-motion';

const testimonials = [
  { quote: "Always gets the attention! It's my go-to bag for work and weekends.", author: "Priya S." },
  { quote: "Spacious and sleek. I love how it fits my laptop without looking bulky.", author: "Ananya M." },
  { quote: "The color is exactly as shown. Premium quality vegan leather.", author: "Sarah J." }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export function Testimonials() {
  return (
    <section className="py-24 bg-white text-center overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.h3 
          className="text-[#5a7c65] text-xs font-bold tracking-[0.2em] uppercase mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          You Carry Us Best
        </motion.h3>
        <motion.h2 
          className="text-3xl md:text-4xl font-serif mb-16 text-gray-900"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          What They <span className="text-gradient-animated">Say</span>
        </motion.h2>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {testimonials.map((item, idx) => (
            <motion.div 
              key={idx} 
              variants={cardVariants}
              className="p-8 bg-[#f9f9f9] rounded-xl relative group cursor-default card-glass"
              whileHover={{ 
                y: -8,
                boxShadow: "0 20px 50px rgba(0, 0, 0, 0.1)",
                transition: { duration: 0.3 }
              }}
            >
              {/* Animated Quote Icon */}
              <motion.div 
                className="text-[#5a7c65] text-5xl font-serif mb-4"
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity,
                  delay: idx * 0.3,
                  ease: "easeInOut"
                }}
              >
                "
              </motion.div>
              <p className="text-gray-600 italic mb-6 text-lg leading-relaxed">{item.quote}</p>
              <motion.div 
                className="w-12 h-[1px] bg-gradient-to-r from-transparent via-[#5a7c65] to-transparent mx-auto mb-4"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + idx * 0.1, duration: 0.5 }}
              />
              <motion.p 
                className="text-sm font-bold tracking-widest text-gray-900 uppercase"
                whileHover={{ color: '#5a7c65', transition: { duration: 0.2 } }}
              >
                {item.author}
              </motion.p>
              
              {/* Hover glow effect */}
              <motion.div 
                className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#5a7c65]/5 to-[#d4a373]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

