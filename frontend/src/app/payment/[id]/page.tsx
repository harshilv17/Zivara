'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Check, Smartphone, Copy, CheckCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import QRCode from 'qrcode';

interface Order {
  id: number;
  total: number;
  paymentStatus: string;
  paymentMethod: string;
}

const MERCHANT_UPI = 'zivara@upi'; // Replace with actual UPI ID

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const { token } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [qrCode, setQrCode] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }

    // Fetch order
    fetch(`http://localhost:4000/api/orders/${params.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(async (data) => {
        setOrder(data);
        setLoading(false);

        if (data.paymentMethod === 'UPI' && data.paymentStatus === 'PENDING') {
          // Generate UPI link and QR
          const upiLink = `upi://pay?pa=${MERCHANT_UPI}&pn=Zivara&am=${data.total}&cu=INR&tn=Order${data.id}`;
          const qr = await QRCode.toDataURL(upiLink, { width: 256, margin: 2 });
          setQrCode(qr);
        }
      })
      .catch(() => setLoading(false));
  }, [params.id, token, router]);

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(MERCHANT_UPI);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirmPayment = async () => {
    setConfirming(true);
    try {
      await fetch(`http://localhost:4000/api/orders/${params.id}/payment`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ paymentStatus: 'COMPLETED' })
      });
      router.push(`/orders`);
    } catch (error) {
      console.error('Failed to confirm payment:', error);
    } finally {
      setConfirming(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>;
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-xl text-gray-500 mb-4">Order not found</p>
        <Link href="/orders" className="text-[#5a7c65] underline">View Orders</Link>
      </div>
    );
  }

  // COD - Direct success
  if (order.paymentMethod === 'COD') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#5a7c65]/10 to-white flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-serif mb-2">Order Confirmed!</h1>
          <p className="text-gray-500 mb-6">Your order #{order.id} has been placed successfully.</p>
          <p className="text-lg font-medium mb-6">Pay ₹{order.total.toLocaleString()} on delivery</p>
          <Link 
            href="/orders"
            className="inline-block w-full bg-[#5a7c65] text-white py-3 rounded-lg font-medium hover:bg-[#4a6652] transition-colors"
          >
            View Orders
          </Link>
        </div>
      </div>
    );
  }

  // Payment completed
  if (order.paymentStatus === 'COMPLETED') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#5a7c65]/10 to-white flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-serif mb-2">Payment Successful!</h1>
          <p className="text-gray-500 mb-6">Your payment for order #{order.id} has been confirmed.</p>
          <Link 
            href="/orders"
            className="inline-block w-full bg-[#5a7c65] text-white py-3 rounded-lg font-medium hover:bg-[#4a6652] transition-colors"
          >
            View Orders
          </Link>
        </div>
      </div>
    );
  }

  // UPI Payment Screen
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#5a7c65]/10 to-white py-12">
      <div className="container mx-auto px-4 max-w-lg">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#5a7c65] to-[#4a6652] text-white p-6 text-center">
            <Smartphone className="w-10 h-10 mx-auto mb-3" />
            <h1 className="text-2xl font-medium">Pay with UPI</h1>
            <p className="text-white/80 mt-1">Order #{order.id}</p>
          </div>

          {/* Amount */}
          <div className="text-center py-8 border-b">
            <p className="text-gray-500 text-sm">Amount to Pay</p>
            <p className="text-4xl font-bold text-gray-900 mt-1">₹{order.total.toLocaleString()}</p>
          </div>

          {/* QR Code */}
          <div className="p-8 text-center">
            <p className="text-gray-600 mb-4">Scan QR code with any UPI app</p>
            {qrCode && (
              <div className="inline-block p-4 bg-white rounded-xl border-2 border-dashed border-gray-200">
                <img src={qrCode} alt="UPI QR Code" className="w-48 h-48" />
              </div>
            )}

            <div className="mt-6">
              <p className="text-gray-500 text-sm mb-2">Or pay to UPI ID</p>
              <div className="flex items-center justify-center gap-2 bg-gray-50 rounded-lg p-3">
                <code className="text-lg font-mono text-gray-800">{MERCHANT_UPI}</code>
                <button 
                  onClick={handleCopyUPI}
                  className="p-2 hover:bg-gray-200 rounded transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-gray-500" />}
                </button>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="p-6 bg-gray-50 space-y-3">
            <button
              onClick={handleConfirmPayment}
              disabled={confirming}
              className="w-full bg-gradient-to-r from-[#5a7c65] to-[#4a6652] text-white py-4 rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50"
            >
              {confirming ? 'Confirming...' : 'I have completed the payment'}
            </button>
            <p className="text-center text-xs text-gray-400">
              Click above after making the payment through your UPI app
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
