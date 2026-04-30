'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useAuth } from './AuthContext';

interface CartItem {
  id: number;
  productId: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    price: number;
    image: string;
  };
}

interface Cart {
  id: number;
  items: CartItem[];
}

interface CartContextType {
  cart: Cart | null;
  itemCount: number;
  total: number;
  addToCart: (productId: number, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const API_URL = 'http://localhost:4000/api';

export function CartProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    if (!token) {
      setCart(null);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCart(data);
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    }
  }, [token]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = async (productId: number, quantity = 1) => {
    if (!token) throw new Error('Please login to add items to cart');
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ productId, quantity })
      });
      if (res.ok) {
        const data = await res.json();
        setCart(data);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    if (!token) return;
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/cart/item/${itemId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ quantity })
      });
      if (res.ok) {
        const data = await res.json();
        setCart(data);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = async (itemId: number) => {
    if (!token) return;
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/cart/item/${itemId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCart(data);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      await fetch(`${API_URL}/cart/clear`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart(null);
    } finally {
      setIsLoading(false);
    }
  };

  const itemCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const total = cart?.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0) || 0;

  return (
    <CartContext.Provider value={{ cart, itemCount, total, addToCart, updateQuantity, removeItem, clearCart, refreshCart, isLoading }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
