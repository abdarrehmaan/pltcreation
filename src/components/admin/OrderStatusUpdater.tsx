'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

interface OrderStatusUpdaterProps {
  orderId: string;
  currentStatus: string;
}

export default function OrderStatusUpdater({ orderId, currentStatus }: OrderStatusUpdaterProps) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [updating, setUpdating] = useState(false);

  const handleUpdate = async () => {
    if (status === currentStatus) return;

    setUpdating(true);
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, status }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        toast.success('Order status updated successfully!');
        router.refresh();
      } else {
        toast.error(json.error || 'Failed to update order status');
      }
    } catch (err: any) {
      toast.error(err.message || 'An error occurred');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        disabled={updating}
        className="input-base py-2 w-auto bg-white"
      >
        <option value="PENDING">Pending</option>
        <option value="CONFIRMED">Confirmed</option>
        <option value="PROCESSING">Processing</option>
        <option value="SHIPPED">Shipped</option>
        <option value="DELIVERED">Delivered</option>
        <option value="CANCELLED">Cancelled</option>
      </select>
      <button
        onClick={handleUpdate}
        disabled={updating || status === currentStatus}
        className="btn-primary py-2 px-4 flex items-center gap-1.5 disabled:opacity-50"
      >
        {updating && <Loader2 className="animate-spin" size={14} />}
        Update Status
      </button>
    </div>
  );
}
