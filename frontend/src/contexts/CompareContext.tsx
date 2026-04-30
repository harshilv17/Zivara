'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  inStock: boolean;
}

interface CompareContextType {
  compareList: Product[];
  addToCompare: (product: Product) => void;
  removeFromCompare: (productId: number) => void;
  clearCompare: () => void;
  isInCompare: (productId: number) => boolean;
  maxItems: number;
}

const CompareContext = createContext<CompareContextType | null>(null);

const MAX_COMPARE_ITEMS = 4;

export function CompareProvider({ children }: { children: ReactNode }) {
  const [compareList, setCompareList] = useState<Product[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('zivara-compare');
    if (saved) {
      try {
        setCompareList(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse compare list:', e);
      }
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('zivara-compare', JSON.stringify(compareList));
  }, [compareList]);

  const addToCompare = (product: Product) => {
    if (compareList.length >= MAX_COMPARE_ITEMS) {
      return; // Max items reached
    }
    if (!compareList.find((p) => p.id === product.id)) {
      setCompareList((prev) => [...prev, product]);
    }
  };

  const removeFromCompare = (productId: number) => {
    setCompareList((prev) => prev.filter((p) => p.id !== productId));
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  const isInCompare = (productId: number) => {
    return compareList.some((p) => p.id === productId);
  };

  return (
    <CompareContext.Provider
      value={{
        compareList,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isInCompare,
        maxItems: MAX_COMPARE_ITEMS,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
}
