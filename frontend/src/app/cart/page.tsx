'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function CartPage() {
  const { cart, itemCount, total, updateQuantity, removeItem, isLoading } = useCart();
  const { user, token } = useAuth();
  const router = useRouter();

  if (!token) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center py-24">
        <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
        <h1 className="text-2xl font-serif mb-4">Please login to view your cart</h1>
        <Link href="/login" className="text-[#5a7c65] underline">
          Sign in
        </Link>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center py-24">
        <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
        <h1 className="text-2xl font-serif mb-4">Your cart is empty</h1>
        <Link href="/shop" className="text-[#5a7c65] underline">
          Continue shopping
        </Link>
      </div>
    );
  }

  const handleCheckout = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/orders', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        router.push('/orders');
      }
    } catch (error) {
      console.error('Checkout failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-white py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-serif mb-12">Your Cart ({itemCount} items)</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            {cart.items.map((item) => (
              <div key={item.id} className="flex gap-6 p-4 border border-gray-100 rounded-sm">
                <div className="relative w-24 h-24 bg-[#f5f5f0] flex-shrink-0">
                  <Image
                    src={item.product.image}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-serif text-lg">{item.product.name}</h3>
                  <p className="text-gray-500 text-sm">₹ {item.product.price.toLocaleString()}</p>

                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center border border-gray-200">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={isLoading}
                        className="p-2 hover:bg-gray-50"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-4">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={isLoading}
                        className="p-2 hover:bg-gray-50"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      disabled={isLoading}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">₹ {(item.product.price * item.quantity).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-[#f9f9f9] p-8 h-fit">
            <h2 className="text-xl font-serif mb-6">Order Summary</h2>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span>₹ {total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Shipping</span>
                <span className="text-[#5a7c65]">FREE</span>
              </div>
            </div>
            <div className="border-t border-gray-200 pt-4 mb-6">
              <div className="flex justify-between font-medium text-lg">
                <span>Total</span>
                <span>₹ {total.toLocaleString()}</span>
              </div>
            </div>
            <Link
              href="/checkout"
              className="w-full block text-center bg-gradient-to-r from-[#5a7c65] to-[#4a6652] text-white py-4 font-medium hover:shadow-lg transition-all rounded-lg"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
