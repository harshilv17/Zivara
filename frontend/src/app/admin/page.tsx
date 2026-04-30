'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Users,
  Package,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  recentOrders: Array<{
    id: number;
    total: number;
    status: string;
    createdAt: string;
    user: { name: string; email: string };
  }>;
  lowStockProducts: Array<{
    id: number;
    name: string;
    stockCount: number;
  }>;
}

const statCards = [
  { 
    key: 'totalRevenue', 
    label: 'Total Revenue', 
    icon: DollarSign, 
    format: (v: number) => `₹${v.toLocaleString()}`,
    color: 'from-emerald-500 to-teal-600',
    trend: '+12.5%',
    trendUp: true,
  },
  { 
    key: 'totalOrders', 
    label: 'Total Orders', 
    icon: ShoppingBag,
    format: (v: number) => v.toString(),
    color: 'from-blue-500 to-indigo-600',
    trend: '+8.2%',
    trendUp: true,
  },
  { 
    key: 'totalProducts', 
    label: 'Products', 
    icon: Package,
    format: (v: number) => v.toString(),
    color: 'from-amber-500 to-orange-600',
    trend: '+3',
    trendUp: true,
  },
  { 
    key: 'totalCustomers', 
    label: 'Customers', 
    icon: Users,
    format: (v: number) => v.toString(),
    color: 'from-purple-500 to-pink-600',
    trend: '+15.3%',
    trendUp: true,
  },
];

export default function AdminDashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    recentOrders: [],
    lowStockProducts: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch products
        const productsRes = await fetch('http://localhost:4000/api/products');
        const products = await productsRes.json();

        // Fetch orders (admin)
        const ordersRes = await fetch('http://localhost:4000/api/orders/admin/all', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const orders = ordersRes.ok ? await ordersRes.json() : [];

        // Calculate stats
        const totalRevenue = Array.isArray(orders) 
          ? orders.reduce((sum: number, o: any) => sum + o.total, 0) 
          : 0;

        setStats({
          totalRevenue,
          totalOrders: Array.isArray(orders) ? orders.length : 0,
          totalProducts: Array.isArray(products) ? products.length : 0,
          totalCustomers: 0, // Would need users endpoint
          recentOrders: Array.isArray(orders) ? orders.slice(0, 5) : [],
          lowStockProducts: Array.isArray(products) 
            ? products.filter((p: any) => (p.stockCount || 100) < 20).slice(0, 5)
            : [],
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchStats();
  }, [token]);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back! Here's what's happening with your store.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <motion.div
            key={stat.key}
            className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${stat.color} p-6 text-white`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium">{stat.label}</p>
                <p className="text-3xl font-bold mt-2">
                  {stat.format((stats as any)[stat.key] || 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-4 text-sm">
              {stat.trendUp ? (
                <ArrowUpRight className="w-4 h-4" />
              ) : (
                <ArrowDownRight className="w-4 h-4" />
              )}
              <span className="font-medium">{stat.trend}</span>
              <span className="text-white/70">vs last month</span>
            </div>
            {/* Decorative circles */}
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full" />
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/5 rounded-full" />
          </motion.div>
        ))}
      </div>

      {/* Recent Orders & Low Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <motion.div
          className="bg-white rounded-2xl p-6 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
          {stats.recentOrders.length > 0 ? (
            <div className="space-y-4">
              {stats.recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="font-medium text-gray-900">Order #{order.id}</p>
                    <p className="text-sm text-gray-500">{order.user?.name || order.user?.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₹{order.total.toLocaleString()}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      order.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                      order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No recent orders</p>
          )}
        </motion.div>

        {/* Low Stock Alert */}
        <motion.div
          className="bg-white rounded-2xl p-6 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-lg font-semibold mb-4">Low Stock Alert</h2>
          {stats.lowStockProducts.length > 0 ? (
            <div className="space-y-4">
              {stats.lowStockProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                  <p className="font-medium text-gray-900">{product.name}</p>
                  <span className="text-sm px-3 py-1 bg-red-100 text-red-700 rounded-full">
                    {product.stockCount || 0} left
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-gray-500">All products are well stocked!</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
