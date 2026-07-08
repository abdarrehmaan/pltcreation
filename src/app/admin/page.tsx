import React from 'react';
import { ShoppingCart, Users, Package, TrendingUp, IndianRupee, ArrowUp, ArrowDown, Eye } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

const kpis = [
  {
    label: 'Total Revenue',
    value: formatPrice(184250),
    change: '+18.4%',
    up: true,
    icon: IndianRupee,
    color: 'bg-brand-50 text-brand-700',
    subtext: 'vs last month',
  },
  {
    label: 'Total Orders',
    value: '1,247',
    change: '+12.1%',
    up: true,
    icon: ShoppingCart,
    color: 'bg-blue-50 text-blue-700',
    subtext: 'vs last month',
  },
  {
    label: 'Customers',
    value: '3,842',
    change: '+9.3%',
    up: true,
    icon: Users,
    color: 'bg-emerald-50 text-emerald-700',
    subtext: 'Total registered',
  },
  {
    label: 'Products',
    value: '512',
    change: '+5 this week',
    up: true,
    icon: Package,
    color: 'bg-amber-50 text-amber-700',
    subtext: 'Active listings',
  },
];

const recentOrders = [
  { id: 'HFZ-001', customer: 'Priya Sharma', items: 2, amount: 4998, status: 'Delivered', date: 'Today, 10:30 AM' },
  { id: 'HFZ-002', customer: 'Fatima Khan', items: 1, amount: 3299, status: 'Shipped', date: 'Today, 9:15 AM' },
  { id: 'HFZ-003', customer: 'Ananya Patel', items: 3, amount: 7200, status: 'Processing', date: 'Yesterday, 6:00 PM' },
  { id: 'HFZ-004', customer: 'Meera Reddy', items: 1, amount: 899, status: 'Confirmed', date: 'Yesterday, 4:30 PM' },
  { id: 'HFZ-005', customer: 'Sana Mirza', items: 2, amount: 5598, status: 'Pending', date: 'Jun 8, 2:10 PM' },
];

const statusClass: Record<string, string> = {
  Delivered: 'status-badge status-delivered',
  Shipped: 'status-badge status-shipped',
  Processing: 'status-badge status-processing',
  Confirmed: 'status-badge status-confirmed',
  Pending: 'status-badge status-pending',
};

const topProducts = [
  { name: 'Ivory Chikankari Kurta', revenue: 62475, orders: 25, stock: 12 },
  { name: 'Rose Gold Co-ord Set', revenue: 52784, orders: 16, stock: 8 },
  { name: 'Floral Cotton Kurti', revenue: 38277, orders: 43, stock: 45 },
  { name: 'Designer Anarkali Suit', revenue: 29994, orders: 6, stock: 3 },
  { name: 'Georgette Unstitched', revenue: 25186, orders: 14, stock: 30 },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpis.map(({ label, value, change, up, icon: Icon, color, subtext }) => (
          <div key={label} className="bg-white rounded-2xl p-5 shadow-card">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-gray-500">{label}</p>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                <Icon size={18} />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
            <div className="flex items-center gap-1.5">
              <span className={`flex items-center gap-0.5 text-xs font-semibold ${up ? 'text-emerald-600' : 'text-red-500'}`}>
                {up ? <ArrowUp size={12} /> : <ArrowDown size={12} />}{change}
              </span>
              <span className="text-xs text-gray-400">{subtext}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Revenue Overview</h2>
            <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none">
              <option>Last 30 Days</option>
              <option>Last 7 Days</option>
              <option>This Year</option>
            </select>
          </div>
          {/* Chart placeholder */}
          <div className="h-52 flex items-center justify-center bg-gradient-to-br from-brand-50 to-ivory-200 rounded-xl">
            <div className="text-center">
              <TrendingUp size={40} className="text-brand-300 mx-auto mb-2" />
              <p className="text-sm text-gray-400">Revenue chart will render here</p>
              <p className="text-xs text-gray-300">(Install Recharts → wire up real data)</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-card">
          <h2 className="font-semibold text-gray-900 mb-4">Order Status</h2>
          <div className="space-y-3">
            {[
              { label: 'Delivered', count: 842, pct: 68, color: 'bg-emerald-400' },
              { label: 'Shipped', count: 186, pct: 15, color: 'bg-blue-400' },
              { label: 'Processing', count: 124, pct: 10, color: 'bg-purple-400' },
              { label: 'Pending', count: 62, pct: 5, color: 'bg-amber-400' },
              { label: 'Cancelled', count: 33, pct: 2, color: 'bg-red-400' },
            ].map(({ label, count, pct, color }) => (
              <div key={label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{label}</span>
                  <span className="font-semibold text-gray-900">{count}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders + Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-card overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Recent Orders</h2>
            <a href="/admin/orders" className="text-sm text-brand-600 hover:underline font-medium">View All</a>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="font-mono text-xs font-semibold text-gray-900">{order.id}</td>
                    <td>{order.customer}</td>
                    <td>{order.items}</td>
                    <td className="font-semibold">{formatPrice(order.amount)}</td>
                    <td><span className={statusClass[order.status] || 'status-badge'}>{order.status}</span></td>
                    <td className="text-xs text-gray-400">{order.date}</td>
                    <td>
                      <button className="btn-icon w-8 h-8" aria-label="View order">
                        <Eye size={14} className="text-gray-500" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Top Products</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {topProducts.map((p, i) => (
              <div key={p.name} className="flex items-center gap-3 p-4">
                <span className="text-xs font-bold text-gray-400 w-4">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{p.name}</p>
                  <p className="text-xs text-gray-400">{p.orders} orders · Stock: {p.stock}</p>
                </div>
                <p className="text-sm font-bold text-brand-700 flex-shrink-0">{formatPrice(p.revenue)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
