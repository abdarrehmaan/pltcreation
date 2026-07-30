'use client';

import React from 'react';
import { FileText, Printer } from 'lucide-react';
import Link from 'next/link';

interface PrintInvoiceButtonProps {
  orderNumber?: string;
}

export default function PrintInvoiceButton({ orderNumber }: PrintInvoiceButtonProps) {
  if (orderNumber) {
    return (
      <Link
        href={`/invoice?query=${encodeURIComponent(orderNumber)}`}
        target="_blank"
        className="btn-primary no-print flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl"
      >
        <FileText size={15} /> View & Download Tax Invoice PDF
      </Link>
    );
  }

  return (
    <button 
      onClick={() => window.print()}
      className="btn-ghost no-print flex items-center gap-2 cursor-pointer"
    >
      <Printer size={16} /> Print Invoice
    </button>
  );
}
