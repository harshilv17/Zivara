'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

const PRODUCTS = [
  {
    id: 1,
    name: 'SWING Matcha',
    price: '₹ 2,499',
    image: '/images/sling.png',
    tag: 'green'
  },
  {
    id: 2,
    name: 'SWING Terra',
    price: '₹ 2,899',
    image: '/images/tote.png',
    tag: 'brown'
  },
  {
    id: 3,
    name: 'SWING Rocher',
    price: '₹ 2,499',
    image: '/images/sling.png', // Reusing placeholder
    tag: 'brown'
  },
  {
    id: 4,
    name: 'SWING Sienna',
    price: '₹ 3,299',
    image: '/images/tote.png', // Reusing placeholder
    tag: 'brown'
  },
];

export function ProductGrid() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center mb-16 text-center space-y-4">
          <span className="text-[#5a7c65] text-sm tracking-widest font-medium uppercase">Collection 2024</span>
          <h2 className="text-4xl md:text-5xl font-serif font-medium text-gray-900">The Swing Series</h2>
          <p className="text-gray-500 max-w-lg">Designed for the movers and shakers. A perfect balance of structure and softness.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {PRODUCTS.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="group product-card bg-white rounded-xl overflow-hidden"
            >
              <Link href={`/product/${product.id}`} className="block">
                <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-[#f8f8f5] to-[#f0f0eb]">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  {/* Quick Add Button on Hover */}
                  <div className="absolute inset-x-4 bottom-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <button className="w-full py-3 bg-white/95 backdrop-blur-sm text-gray-900 text-xs font-semibold tracking-wider hover:bg-[#5a7c65] hover:text-white transition-all rounded-lg shadow-lg uppercase">
                      View Product
                    </button>
                  </div>
                </div>
                
                <div className="p-4 space-y-2 text-center">
                  <h3 className="text-lg font-serif font-medium text-gray-900 group-hover:text-[#5a7c65] transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-[#5a7c65] font-semibold">{product.price}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <Link 
            href="/shop" 
            className="inline-block border-b border-gray-900 pb-1 text-gray-900 text-sm tracking-widest hover:text-[#5a7c65] hover:border-[#5a7c65] transition-all"
          >
            VIEW ALL PRODUCTS
          </Link>
        </div>
      </div>
    </section>
  );
}
