'use client';

import { motion } from 'framer-motion';
import { Marquee } from './ui/AdvancedEffects';
import { Truck, Shield, Leaf, Heart, Star, Award } from 'lucide-react';

const brands = [
  { name: 'Premium Quality', icon: Award },
  { name: 'Free Shipping', icon: Truck },
  { name: 'Secure Payment', icon: Shield },
  { name: 'Eco-Friendly', icon: Leaf },
  { name: 'Made with Love', icon: Heart },
  { name: '5-Star Rated', icon: Star },
];

export function BrandShowcase() {
  return (
    <section className="py-8 bg-[#5a7c65] overflow-hidden">
      <Marquee speed={25} pauseOnHover>
        <div className="flex gap-16 items-center">
          {brands.map((brand, idx) => (
            <motion.div
              key={idx}
              className="flex items-center gap-3 text-white/90 whitespace-nowrap group"
              whileHover={{ scale: 1.05 }}
            >
              <brand.icon className="w-5 h-5 group-hover:text-[#d4a373] transition-colors" />
              <span className="text-sm font-medium tracking-wide uppercase">{brand.name}</span>
            </motion.div>
          ))}
        </div>
      </Marquee>
    </section>
  );
}
