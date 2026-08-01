import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { formatPrice, sanitizeImageUrl } from '@/lib/utils';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import OrderStatusUpdater from '@/components/admin/OrderStatusUpdater';
import PrintInvoiceButton from '@/components/admin/PrintInvoiceButton';

export default async function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let orderDb = null;

  try {
    orderDb = await prisma.order.findUnique({
      where: { id },
      include: {
        user: true,
        items: {
          include: {
            product: {
              include: {
                images: true,
              },
            },
          },
        },
      },
    });
  } catch (e) {
    // ignore
  }

  if (!orderDb) {
    orderDb = await prisma.order.findFirst({
      where: {
        OR: [
          { orderNumber: id },
          { id: id },
        ],
      },
      include: {
        user: true,
        items: {
          include: {
            product: {
              include: {
                images: true,
              },
            },
          },
        },
      },
    });
  }

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
    items: orderDb.items.map((item: any) => ({
      id: item.id,
      name: item.productName,
      sku: item.productSku,
      price: Number(item.unitPrice),
      quantity: item.quantity,
      size: item.size || '—',
      color: item.color || '—',
      image: sanitizeImageUrl(item.imageUrl || item.product?.images?.[0]?.url || item.product?.image),
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
          <PrintInvoiceButton orderNumber={order.orderNumber} />
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
                <div key={item.id} className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0">
                  <div className="relative w-16 h-16 rounded-xl border border-gray-200 overflow-hidden bg-gray-100 flex-shrink-0 shadow-xs">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image || '/banner-kurti.jpg'}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm">{item.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      SKU: <span className="font-mono">{item.sku}</span> • Size: <span className="font-semibold text-gray-700">{item.size}</span> • Color: <span className="font-semibold text-gray-700">{item.color}</span>
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-gray-900 text-sm">{formatPrice(item.price)}</p>
                    <p className="text-xs text-gray-500 font-medium">Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium text-gray-900">{formatPrice(order.subtotal)}</span>
              </div>
              {order.tax > 0 && (
                <div className="flex justify-between text-xs text-gray-400 pl-3">
                  <span>Includes 5% GST</span>
                  <span>{formatPrice(order.tax)}</span>
                </div>
              )}
              {order.discount > 0 && (
                <div className="flex justify-between text-sm text-emerald-600">
                  <span>Coupon Discount</span>
                  <span>-{formatPrice(order.discount)}</span>
                </div>
              )}
              {order.prepaidDiscount > 0 && (
                <div className="flex justify-between text-sm text-emerald-600">
                  <span>Prepaid Discount</span>
                  <span>-{formatPrice(order.prepaidDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Delivery Charges</span>
                <span className="font-medium text-gray-900">{order.shipping === 0 ? 'FREE' : formatPrice(order.shipping)}</span>
              </div>
              <div className="flex justify-between text-base font-bold pt-2 border-t mt-2">
                <span className="text-gray-900">Final Payable Amount (Actual Payment)</span>
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
