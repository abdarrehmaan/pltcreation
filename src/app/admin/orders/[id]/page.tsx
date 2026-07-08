import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Printer, Truck, CheckCircle, Package } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export default async function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // Mock Order Data
  const order = {
    id: id,
    orderNumber: 'ORD-2026-8899',
    date: new Date().toISOString(),
    status: 'PROCESSING',
    paymentStatus: 'PAID',
    paymentMethod: 'UPI',
    customer: {
      name: 'Priya Sharma',
      email: 'priya@example.com',
      phone: '+91 9876543210',
    },
    shippingAddress: {
      line1: '123 Rose Avenue',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
    },
    items: [
      { id: '1', name: 'Hand-embroidered Chikankari Kurta', sku: 'HIF-CHK-001', price: 2999, quantity: 1, size: 'M' },
    ],
    subtotal: 2999,
    shipping: 0,
    total: 2999,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/orders" className="btn-icon">
            <ArrowLeft size={18} className="text-gray-600" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 font-display">
              Order {order.orderNumber}
            </h2>
            <p className="text-sm text-gray-500">
              Placed on {new Date(order.date).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-ghost">
            <Printer size={16} /> Print Invoice
          </button>
          <div className="flex items-center gap-2">
            <select className="input-base py-2 w-auto bg-white">
              <option value="PENDING">Pending</option>
              <option value="PROCESSING" selected>Processing</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
            <button className="btn-primary py-2 px-4">Update Status</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Order Items</h3>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="font-semibold text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-500">SKU: {item.sku} • Size: {item.size}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatPrice(item.price)}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium text-gray-900">{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium text-gray-900">{formatPrice(order.shipping)}</span>
              </div>
              <div className="flex justify-between text-base font-bold pt-2 border-t mt-2">
                <span className="text-gray-900">Total</span>
                <span className="text-brand-700">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Customer Info</h3>
            <div className="space-y-3 text-sm">
              <p><span className="text-gray-500 block text-xs">Name</span> {order.customer.name}</p>
              <p><span className="text-gray-500 block text-xs">Email</span> {order.customer.email}</p>
              <p><span className="text-gray-500 block text-xs">Phone</span> {order.customer.phone}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Shipping Address</h3>
            <div className="text-sm text-gray-700 space-y-1">
              <p>{order.shippingAddress.line1}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Payment Info</h3>
            <div className="text-sm text-gray-700 space-y-2">
              <div className="flex justify-between">
                <span>Method</span>
                <span className="font-medium">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Status</span>
                <span className="status-badge status-delivered">{order.paymentStatus}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
