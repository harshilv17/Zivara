'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Package, Truck, Home } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';

interface Order {
  id: number;
  total: number;
  status: string;
  paymentStatus: string;
  shippingName: string;
  shippingAddress: string;
  shippingCity: string;
  shippingPincode: string;
  createdAt: string;
  items: Array<{
    id: number;
    quantity: number;
    price: number;
    product: { name: string; image: string };
  }>;
}

export default function OrderSuccessPage() {
  const params = useParams();
  const { token } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token && params.id) {
      fetch(`http://localhost:4000/api/orders/${params.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          setOrder(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [token, params.id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-gray-500">Order not found</p>
        <Link href="/" className="text-[#5a7c65] underline mt-4">Go Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#5a7c65]/5 to-white py-16">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Success Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="text-center mb-8"
        >
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-serif mb-2">Order Confirmed!</h1>
          <p className="text-gray-500">Thank you for your purchase</p>
        </motion.div>

        {/* Order Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-[#5a7c65] text-white p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-white/70 text-sm">Order Number</p>
                <p className="text-2xl font-medium">#{order.id}</p>
              </div>
              <div className="text-right">
                <p className="text-white/70 text-sm">Total Amount</p>
                <p className="text-2xl font-medium">₹{order.total.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Status Timeline */}
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Order Placed</p>
                  <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex-1 h-1 bg-gray-200 mx-4 rounded">
                <div className={`h-1 rounded transition-all ${order.status !== 'PENDING' ? 'bg-[#5a7c65] w-1/2' : 'w-0'}`} />
              </div>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${order.status === 'SHIPPED' || order.status === 'COMPLETED' ? 'bg-green-100' : 'bg-gray-100'}`}>
                  <Truck className={`w-5 h-5 ${order.status === 'SHIPPED' || order.status === 'COMPLETED' ? 'text-green-600' : 'text-gray-400'}`} />
                </div>
                <div>
                  <p className={`font-medium ${order.status !== 'SHIPPED' && order.status !== 'COMPLETED' ? 'text-gray-400' : ''}`}>Shipped</p>
                </div>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="p-6 border-b">
            <h3 className="font-medium mb-4">Order Items</h3>
            <div className="space-y-3">
              {order.items.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.product.name} × {item.quantity}</span>
                  <span className="font-medium">₹{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="p-6">
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <Home className="w-4 h-4" /> Shipping Address
            </h3>
            <p className="text-gray-600 text-sm">
              {order.shippingName}<br />
              {order.shippingAddress}<br />
              {order.shippingCity}, {order.shippingPincode}
            </p>
          </div>
        </motion.div>

        {/* Actions */}
        <div className="mt-8 flex gap-4">
          <Link
            href="/orders"
            className="flex-1 text-center py-4 border border-[#5a7c65] text-[#5a7c65] rounded-lg font-medium hover:bg-[#5a7c65]/5 transition-colors"
          >
            View All Orders
          </Link>
          <Link
            href="/shop"
            className="flex-1 text-center py-4 bg-[#5a7c65] text-white rounded-lg font-medium hover:bg-[#4a6652] transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
