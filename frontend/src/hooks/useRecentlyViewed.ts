'use client';

import { useState, useEffect, useCallback } from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

const MAX_ITEMS = 10;
const STORAGE_KEY = 'zivara-recently-viewed';

export function useRecentlyViewed() {
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setRecentlyViewed(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse recently viewed:', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recentlyViewed));
    }
  }, [recentlyViewed, isLoaded]);

  const addProduct = useCallback((product: Product) => {
    setRecentlyViewed((prev) => {
      // Remove if already exists
      const filtered = prev.filter((p) => p.id !== product.id);
      // Add to beginning
      const updated = [product, ...filtered];
      // Limit to max items
      return updated.slice(0, MAX_ITEMS);
    });
  }, []);

  const removeProduct = useCallback((productId: number) => {
    setRecentlyViewed((prev) => prev.filter((p) => p.id !== productId));
  }, []);

  const clearAll = useCallback(() => {
    setRecentlyViewed([]);
  }, []);

  return {
    recentlyViewed,
    addProduct,
    removeProduct,
    clearAll,
    isLoaded,
  };
}
