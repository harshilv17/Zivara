'use client';

import Link from 'next/link';
import { ShoppingBag, Menu, X, LogOut, Heart, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { SearchBar } from './SearchBar';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout, isLoading } = useAuth();
  const { itemCount } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <div className="bg-[#5a7c65] text-white text-xs text-center py-2 tracking-wide">
        FREE SHIPPING ON PRE-PAID ORDERS
      </div>
      <header
        className={cn(
          'sticky top-0 z-50 transition-all duration-300 w-full border-b border-transparent',
          isScrolled ? 'bg-white/80 backdrop-blur-md py-3 shadow-sm' : 'bg-white py-5'
        )}
      >
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          <button 
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6 text-gray-800" />
          </button>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide text-gray-800">
            <Link href="/shop" className="hover:text-[#5a7c65] transition-colors">SHOP</Link>
            <Link href="/collections" className="hover:text-[#5a7c65] transition-colors">COLLECTIONS</Link>
            <Link href="/about" className="hover:text-[#5a7c65] transition-colors">ABOUT US</Link>
          </nav>

          <Link href="/" className="text-2xl font-serif font-bold tracking-tighter text-gray-900 absolute left-1/2 -translate-x-1/2 md:static md:transform-none">
            ZIVARA
          </Link>

          <div className="flex items-center gap-3">
            <SearchBar />
            {!isLoading && (
              <>
                {user ? (
                  <div className="hidden md:flex items-center gap-3">
                    <Link href="/profile" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                      <User className="w-5 h-5 text-gray-700" />
                    </Link>
                    <Link href="/wishlist" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                      <Heart className="w-5 h-5 text-gray-700" />
                    </Link>
                    <Link href="/orders" className="text-sm text-gray-600 hover:text-[#5a7c65]">
                      Orders
                    </Link>
                    {user.role === 'ADMIN' && (
                      <Link href="/admin" className="text-sm text-gray-600 hover:text-[#5a7c65]">
                        Admin
                      </Link>
                    )}
                    <button onClick={logout} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                      <LogOut className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <Link href="/login" className="hidden md:block text-sm text-gray-600 hover:text-[#5a7c65]">
                    Login
                  </Link>
                )}
              </>
            )}
            <Link href="/cart" className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ShoppingBag className="w-5 h-5 text-gray-800" />
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 bg-[#5a7c65] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            className="fixed inset-0 z-[100] bg-white w-[80%] max-w-sm shadow-2xl md:hidden"
          >
            <div className="p-5 flex flex-col h-full">
              <div className="flex justify-between items-center mb-8">
                <span className="text-xl font-serif font-bold">ZIVARA</span>
                <button onClick={() => setIsMobileMenuOpen(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>
              <nav className="flex flex-col gap-6 text-lg font-medium">
                <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)}>Shop</Link>
                <Link href="/collections" onClick={() => setIsMobileMenuOpen(false)}>Collections</Link>
                <Link href="/about" onClick={() => setIsMobileMenuOpen(false)}>About Us</Link>
                <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
                {user ? (
                  <>
                    <Link href="/orders" onClick={() => setIsMobileMenuOpen(false)}>My Orders</Link>
                    {user.role === 'ADMIN' && (
                      <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)}>Admin</Link>
                    )}
                    <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="text-left text-red-500">
                      Logout
                    </button>
                  </>
                ) : (
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
                )}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-[90] bg-black/20 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
