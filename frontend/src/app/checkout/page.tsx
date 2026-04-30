'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';
import { ArrowLeft, CreditCard, Smartphone } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const { cart, total, refreshCart } = useCart();
  const { user, token } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    shippingName: user?.name || '',
    shippingPhone: '',
    shippingAddress: '',
    shippingCity: '',
    shippingPincode: '',
    paymentMethod: 'RAZORPAY'
  });

  if (!token) {
    router.push('/login');
    return null;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center py-24">
        <p className="text-xl text-gray-500 mb-4">Your cart is empty</p>
        <Link href="/shop" className="text-[#5a7c65] underline">Continue shopping</Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Create order in our system
      const orderRes = await fetch('http://localhost:4000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!orderRes.ok) throw new Error('Failed to create order');
      const order = await orderRes.json();

      if (formData.paymentMethod === 'COD') {
        await refreshCart();
        router.push(`/order-success/${order.id}`);
        return;
      }

      // 2. Create Razorpay payment order
      const paymentRes = await fetch('http://localhost:4000/api/payments/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ orderId: order.id })
      });

      if (!paymentRes.ok) throw new Error('Failed to create payment order');
      const paymentOrder = await paymentRes.json();

      // 3. Open Razorpay checkout
      const options = {
        key: paymentOrder.key,
        amount: paymentOrder.amount,
        currency: paymentOrder.currency,
        name: 'Zivara',
        description: `Order #${order.id}`,
        order_id: paymentOrder.orderId,
        handler: async function (response: any) {
          // 4. Verify payment
          const verifyRes = await fetch('http://localhost:4000/api/payments/verify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: order.id
            })
          });

          if (verifyRes.ok) {
            await refreshCart();
            router.push(`/order-success/${order.id}`);
          } else {
            alert('Payment verification failed');
          }
        },
        prefill: {
          name: formData.shippingName,
          contact: formData.shippingPhone,
        },
        theme: {
          color: '#5a7c65'
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error('Checkout failed:', error);
      alert('Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      
      <div className="min-h-screen bg-[#fafafa] py-12">
        <div className="container mx-auto px-4">
          <Link href="/cart" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#5a7c65] mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to Cart
          </Link>

          <h1 className="text-3xl font-serif mb-8">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Shipping Form */}
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm">
              <h2 className="text-xl font-medium mb-6">Shipping Details</h2>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={formData.shippingName}
                    onChange={(e) => setFormData({ ...formData, shippingName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a7c65]/20 focus:border-[#5a7c65]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.shippingPhone}
                    onChange={(e) => setFormData({ ...formData, shippingPhone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a7c65]/20 focus:border-[#5a7c65]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <textarea
                    value={formData.shippingAddress}
                    onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a7c65]/20 focus:border-[#5a7c65] resize-none"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <input
                      type="text"
                      value={formData.shippingCity}
                      onChange={(e) => setFormData({ ...formData, shippingCity: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a7c65]/20 focus:border-[#5a7c65]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
                    <input
                      type="text"
                      value={formData.shippingPincode}
                      onChange={(e) => setFormData({ ...formData, shippingPincode: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a7c65]/20 focus:border-[#5a7c65]"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h2 className="text-xl font-medium mb-4">Payment Method</h2>
                <div className="space-y-3">
                  <label className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-all ${
                    formData.paymentMethod === 'RAZORPAY' ? 'border-[#5a7c65] bg-[#5a7c65]/5' : 'border-gray-200'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="RAZORPAY"
                      checked={formData.paymentMethod === 'RAZORPAY'}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      formData.paymentMethod === 'RAZORPAY' ? 'border-[#5a7c65]' : 'border-gray-300'
                    }`}>
                      {formData.paymentMethod === 'RAZORPAY' && <div className="w-2.5 h-2.5 rounded-full bg-[#5a7c65]" />}
                    </div>
                    <Smartphone className="w-5 h-5 text-[#5a7c65]" />
                    <div>
                      <p className="font-medium">Pay Online</p>
                      <p className="text-sm text-gray-500">UPI, Cards, NetBanking, Wallets</p>
                    </div>
                  </label>
                  <label className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-all ${
                    formData.paymentMethod === 'COD' ? 'border-[#5a7c65] bg-[#5a7c65]/5' : 'border-gray-200'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={formData.paymentMethod === 'COD'}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      formData.paymentMethod === 'COD' ? 'border-[#5a7c65]' : 'border-gray-300'
                    }`}>
                      {formData.paymentMethod === 'COD' && <div className="w-2.5 h-2.5 rounded-full bg-[#5a7c65]" />}
                    </div>
                    <CreditCard className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium">Cash on Delivery</p>
                      <p className="text-sm text-gray-500">Pay when you receive</p>
                    </div>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-8 bg-gradient-to-r from-[#5a7c65] to-[#4a6652] text-white py-4 rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50"
              >
                {loading ? 'Processing...' : `Pay ₹${total.toLocaleString()}`}
              </button>
            </form>

            {/* Order Summary */}
            <div className="bg-white p-8 rounded-xl shadow-sm h-fit sticky top-24">
              <h2 className="text-xl font-medium mb-6">Order Summary</h2>
              <div className="space-y-4 max-h-[300px] overflow-auto">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative w-16 h-16 bg-[#f5f5f0] rounded-lg flex-shrink-0 overflow-hidden">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.product.name}</p>
                      <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium">₹{(item.product.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>
              <div className="border-t mt-6 pt-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span className="text-[#5a7c65] font-medium">FREE</span>
                </div>
                <div className="flex justify-between text-lg font-medium pt-3 border-t">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
