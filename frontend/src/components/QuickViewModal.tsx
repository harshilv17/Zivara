'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { X, Heart, ShoppingBag, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  inStock: boolean;
  images?: string[];
}

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const [currentImage, setCurrentImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addToCart } = useCart();
  const modalRef = useRef<HTMLDivElement>(null);

  // Get images array (use product image as fallback)
  const images = product?.images?.length ? product.images : [product?.image || ''];

  // Reset state when product changes
  useEffect(() => {
    setCurrentImage(0);
    setQuantity(1);
    setAddedToCart(false);
  }, [product?.id]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleAddToCart = async () => {
    if (!product?.id) return;
    await addToCart(product.id, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  if (!product) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            ref={modalRef}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-4xl md:w-[90vw] bg-white rounded-2xl shadow-2xl z-50 overflow-hidden"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center z-10 hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 h-full max-h-[90vh] overflow-auto">
              {/* Image Gallery */}
              <div className="relative aspect-square md:h-full bg-[#f8f8f5]">
                <Image
                  src={images[currentImage]}
                  alt={product.name}
                  fill
                  className="object-contain p-8"
                />

                {/* Navigation arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Image dots */}
                {images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {images.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImage(idx)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          idx === currentImage ? 'bg-[#5a7c65]' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-8 flex flex-col">
                <span className="text-[#5a7c65] text-sm font-medium uppercase tracking-wider">
                  {product.category}
                </span>
                <h2 className="text-2xl md:text-3xl font-serif mt-2 mb-4">{product.name}</h2>
                <p className="text-2xl font-medium text-gray-900 mb-4">
                  ₹{product.price.toLocaleString()}
                </p>
                <p className="text-gray-500 mb-6 flex-1">{product.description}</p>

                {/* Quantity Selector */}
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-sm font-medium">Quantity:</span>
                  <div className="flex items-center border border-gray-200 rounded-lg">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-4 py-2 hover:bg-gray-50 transition-colors"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 border-x border-gray-200">{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="px-4 py-2 hover:bg-gray-50 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <motion.button
                    onClick={handleAddToCart}
                    disabled={!product.inStock || addedToCart}
                    className={`flex-1 py-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors ${
                      addedToCart
                        ? 'bg-green-500 text-white'
                        : product.inStock
                        ? 'bg-[#5a7c65] text-white hover:bg-[#4a6652]'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                    whileTap={{ scale: 0.98 }}
                  >
                    {addedToCart ? (
                      <>
                        <Check className="w-5 h-5" />
                        Added to Cart
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-5 h-5" />
                        {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                      </>
                    )}
                  </motion.button>
                  <motion.button
                    className="w-14 h-14 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                    whileTap={{ scale: 0.95 }}
                  >
                    <Heart className="w-5 h-5" />
                  </motion.button>
                </div>

                {/* View full details link */}
                <Link
                  href={`/product/${product.id}`}
                  className="text-center text-[#5a7c65] mt-6 underline text-sm hover:text-[#4a6652]"
                  onClick={onClose}
                >
                  View Full Details
                </Link>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
