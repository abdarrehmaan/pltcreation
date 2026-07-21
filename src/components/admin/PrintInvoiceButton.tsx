'use client';

import React from 'react';
import { Printer } from 'lucide-react';

export default function PrintInvoiceButton() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <button 
      onClick={handlePrint}
      className="btn-ghost no-print flex items-center gap-2 cursor-pointer"
    >
      <Printer size={16} /> Print Invoice
    </button>
  );
}
