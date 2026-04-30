'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

export function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:4000/api/products?search=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.slice(0, 5));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (productId: number) => {
    setIsOpen(false);
    setQuery('');
    router.push(`/product/${productId}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      router.push(`/shop?search=${encodeURIComponent(query)}`);
      setQuery('');
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
      >
        <Search className="w-5 h-5 text-gray-700" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-[100]"
            />
            
            {/* Search Modal */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-xl z-[100] px-4"
            >
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                <form onSubmit={handleSearch} className="flex items-center gap-3 p-4 border-b">
                  <Search className="w-5 h-5 text-gray-400" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search products..."
                    className="flex-1 text-lg outline-none"
                  />
                  <button type="button" onClick={() => setIsOpen(false)}>
                    <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                  </button>
                </form>

                {loading && (
                  <div className="p-4 text-center text-gray-400">Searching...</div>
                )}

                {!loading && results.length > 0 && (
                  <div className="max-h-80 overflow-auto">
                    {results.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => handleSelect(product.id)}
                        className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors text-left"
                      >
                        <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                          <img src={product.image} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-[#5a7c65]">₹{product.price.toLocaleString()}</p>
                        </div>
                      </button>
                    ))}
                    <button
                      onClick={handleSearch}
                      className="w-full p-4 text-center text-[#5a7c65] font-medium hover:bg-gray-50 border-t"
                    >
                      View all results for "{query}"
                    </button>
                  </div>
                )}

                {!loading && query.length >= 2 && results.length === 0 && (
                  <div className="p-8 text-center text-gray-400">
                    No products found for "{query}"
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
