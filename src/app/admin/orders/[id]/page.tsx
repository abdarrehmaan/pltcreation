import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import OrderStatusUpdater from '@/components/admin/OrderStatusUpdater';
import PrintInvoiceButton from '@/components/admin/PrintInvoiceButton';

export default async function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const orderDb = await prisma.order.findUnique({
    where: { id },
    include: {
      user: true,
      items: true,
    },
  });

  if (!orderDb) {
    return notFound();
  }

  const order = {
    id: orderDb.id,
    orderNumber: orderDb.orderNumber,
    date: orderDb.createdAt.toISOString(),
    status: orderDb.status,
    paymentStatus: orderDb.paymentStatus,
    paymentMethod: orderDb.paymentMethod,
    customer: {
      name: orderDb.shippingName || orderDb.user?.name || 'Guest',
      email: orderDb.user?.email || '',
      phone: orderDb.shippingPhone || orderDb.user?.phone || '—',
    },
    shippingAddress: {
      line1: orderDb.shippingLine1 || '',
      line2: orderDb.shippingLine2 || '',
      city: orderDb.shippingCity || '',
      state: orderDb.shippingState || '',
      pincode: orderDb.shippingPincode || '',
    },
    items: orderDb.items.map((item) => ({
      id: item.id,
      name: item.productName,
      sku: item.productSku,
      price: Number(item.unitPrice),
      quantity: item.quantity,
      size: item.size || '—',
      color: item.color || '—',
    })),
    subtotal: Number(orderDb.subtotal),
    shipping: Number(orderDb.shippingCharge),
    discount: Number(orderDb.discount || 0),
    prepaidDiscount: Number(orderDb.prepaidDiscount || 0),
    tax: Number(orderDb.tax || 0),
    total: Number(orderDb.total),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/orders" className="btn-icon no-print">
            <ArrowLeft size={18} className="text-gray-600" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 font-display">
              Order {order.orderNumber}
            </h2>
            <p className="text-sm text-gray-500">
              Placed on {new Date(order.date).toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <PrintInvoiceButton />
          <div className="no-print">
            <OrderStatusUpdater orderId={order.id} currentStatus={order.status} />
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
                    <p className="text-xs text-gray-500">SKU: {item.sku} • Size: {item.size} • Color: {item.color}</p>
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
                <span className="text-gray-600">Product Price (GST Included)</span>
                <span className="font-medium text-gray-900">{formatPrice(order.subtotal - order.discount - order.prepaidDiscount)}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-400 pl-3">
                <span>GST Amount (5% Included)</span>
                <span>{formatPrice(order.tax)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-xs text-emerald-600 pl-3">
                  <span>Coupon Discount</span>
                  <span>-{formatPrice(order.discount)}</span>
                </div>
              )}
              {order.prepaidDiscount > 0 && (
                <div className="flex justify-between text-xs text-emerald-600 pl-3">
                  <span>Prepaid Discount</span>
                  <span>-{formatPrice(order.prepaidDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Delivery Charges</span>
                <span className="font-medium text-gray-900">{order.shipping === 0 ? 'FREE' : formatPrice(order.shipping)}</span>
              </div>
              <div className="flex justify-between text-base font-bold pt-2 border-t mt-2">
                <span className="text-gray-900">Final Payable Amount</span>
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
              {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
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
