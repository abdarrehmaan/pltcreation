import React from 'react';
import { TrendingUp, Users, ShoppingBag, DollarSign } from 'lucide-react';

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900 font-display">Analytics Dashboard</h2>
        <select className="input-base py-2 w-auto bg-white">
          <option>Last 7 Days</option>
          <option>Last 30 Days</option>
          <option>This Year</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Sales', value: '₹124,500', trend: '+12.5%', icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-100' },
          { label: 'Total Orders', value: '142', trend: '+8.2%', icon: ShoppingBag, color: 'text-brand-600', bg: 'bg-brand-100' },
          { label: 'Total Customers', value: '1,024', trend: '+5.4%', icon: Users, color: 'text-blue-500', bg: 'bg-blue-100' },
          { label: 'Conversion Rate', value: '3.2%', trend: '+1.1%', icon: TrendingUp, color: 'text-purple-500', bg: 'bg-purple-100' },
        ].map(({ label, value, trend, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-2xl shadow-card p-6">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${bg}`}>
                <Icon size={24} className={color} />
              </div>
              <span className="text-sm font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">{trend}</span>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">{label}</p>
              <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-card p-6 min-h-[300px] flex items-center justify-center">
          <p className="text-gray-400">Sales Chart Placeholder (Recharts)</p>
        </div>
        <div className="bg-white rounded-2xl shadow-card p-6 min-h-[300px] flex items-center justify-center">
          <p className="text-gray-400">Top Products Chart Placeholder</p>
        </div>
      </div>
    </div>
  );
}
