'use client';

import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { ToastProvider } from '@/context/ToastContext';
import { CompareProvider } from '@/contexts/CompareContext';
import { ChatWidget } from './ChatWidget';
import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        <ToastProvider>
          <CompareProvider>
            {children}
            <ChatWidget />
          </CompareProvider>
        </ToastProvider>
      </CartProvider>
    </AuthProvider>
  );
}
