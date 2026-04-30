'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ShoppingBag, Heart, ArrowLeft, Check, Star, Truck, Shield, RotateCcw } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Product360Placeholder } from '@/components/Product360Viewer';
import { RevealOnScroll } from '@/components/ui/AdvancedEffects';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

const features = [
  { icon: Truck, title: 'Free Shipping', desc: 'On prepaid orders' },
  { icon: Shield, title: '7-Day Returns', desc: 'Hassle-free' },
  { icon: RotateCcw, title: '1 Year Warranty', desc: 'On all products' },
];

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart, isLoading } = useCart();
  const { token } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showViewer, setShowViewer] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetch(`http://localhost:4000/api/products`)
        .then(res => res.json())
        .then(data => {
          const found = data.find((p: Product) => p.id === Number(params.id));
          setProduct(found || null);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [params.id]);

  const handleAddToCart = async () => {
    if (!token) {
      router.push('/login');
      return;
    }
    
    try {
      await addToCart(product!.id);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div 
          className="spinner"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <p className="text-xl text-gray-500 mb-4">Product not found</p>
          <Link href="/shop" className="text-[#5a7c65] underline hover:no-underline">Back to Shop</Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-[#f8f8f5] py-4">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Link href="/shop" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#5a7c65] transition-colors group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Shop</span>
            </Link>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Section */}
          <RevealOnScroll animation="fadeLeft">
            <div className="relative">
              {/* Toggle between regular view and 360 view */}
              <div className="flex gap-2 mb-4">
                <motion.button
                  onClick={() => setShowViewer(false)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    !showViewer ? 'bg-[#5a7c65] text-white' : 'bg-gray-100 text-gray-600'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Photo
                </motion.button>
                <motion.button
                  onClick={() => setShowViewer(true)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
                    showViewer ? 'bg-[#5a7c65] text-white' : 'bg-gray-100 text-gray-600'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <RotateCcw className="w-4 h-4" />
                  360° View
                </motion.button>
              </div>

              <AnimatePresence mode="wait">
                {showViewer ? (
                  <motion.div
                    key="viewer"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Product360Placeholder image={product.image} productName={product.name} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="photo"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="relative aspect-square bg-gradient-to-br from-[#f8f8f5] to-[#f0f0eb] rounded-2xl overflow-hidden group"
                  >
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-contain p-8 group-hover:scale-105 transition-transform duration-700"
                    />
                    {/* Decorative elements */}
                    <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full">
                      <span className="text-xs font-medium text-[#5a7c65] uppercase tracking-wider">{product.category}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </RevealOnScroll>

          {/* Details Section */}
          <RevealOnScroll animation="fadeRight" delay={0.2}>
            <div className="flex flex-col justify-center lg:pl-8">
              {/* Category & Rating */}
              <div className="flex items-center gap-4 mb-4">
                <span className="text-[#5a7c65] text-sm uppercase tracking-widest font-medium">{product.category}</span>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#d4a373] text-[#d4a373]" />
                  ))}
                  <span className="text-sm text-gray-500 ml-2">(24 reviews)</span>
                </div>
              </div>

              {/* Name & Price */}
              <motion.h1 
                className="text-4xl lg:text-5xl font-serif mb-4 text-gray-900"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {product.name}
              </motion.h1>
              
              <motion.p 
                className="text-3xl font-medium text-gradient mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                ₹ {product.price.toLocaleString()}
              </motion.p>

              <motion.p 
                className="text-gray-500 leading-relaxed mb-8 text-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {product.description}
              </motion.p>

              {/* Buttons */}
              <motion.div 
                className="flex gap-4 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <motion.button 
                  onClick={handleAddToCart}
                  disabled={isLoading || added}
                  className={`flex-1 py-4 px-8 flex items-center justify-center gap-3 rounded-full font-medium text-lg transition-all ${
                    added 
                      ? 'bg-green-600 text-white' 
                      : 'bg-[#5a7c65] text-white hover:bg-[#4a6652]'
                  } disabled:opacity-70`}
                  whileHover={{ scale: added ? 1 : 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {added ? (
                    <>
                      <Check className="w-5 h-5" />
                      Added to Cart!
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-5 h-5" />
                      {isLoading ? 'Adding...' : 'Add to Cart'}
                    </>
                  )}
                </motion.button>
                
                <motion.button 
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`p-4 border-2 rounded-full transition-all ${
                    isWishlisted 
                      ? 'border-red-500 bg-red-50' 
                      : 'border-gray-200 hover:border-[#5a7c65]'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Heart className={`w-6 h-6 transition-colors ${
                    isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'
                  }`} />
                </motion.button>
              </motion.div>

              {/* Features */}
              <motion.div 
                className="grid grid-cols-3 gap-4 pt-8 border-t border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {features.map((feature, idx) => (
                  <motion.div 
                    key={idx}
                    className="text-center p-4 rounded-xl bg-[#f8f8f5] hover:bg-[#f0f0eb] transition-colors cursor-default"
                    whileHover={{ y: -2 }}
                  >
                    <feature.icon className="w-6 h-6 text-[#5a7c65] mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-900">{feature.title}</p>
                    <p className="text-xs text-gray-500">{feature.desc}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </div>
  );
}

