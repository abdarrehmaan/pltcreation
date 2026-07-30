'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import TaxInvoice, { InvoiceData } from '@/components/invoice/TaxInvoice';
import { exportInvoiceToPdf } from '@/lib/utils/pdfExport';
import { ArrowLeft, Printer, Download, FileText, Loader2 } from 'lucide-react';

export default function OrderDetailsInvoicePage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.id as string;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        if (res.ok) {
          const data = await res.json();
          setOrder(data.order);

          // Map order data into PLT Creation Tax Invoice format
          const formattedInvoice: InvoiceData = {
            invoiceNo: data.order.orderNumber || `PLT-${orderId.substring(0, 8).toUpperCase()}`,
            date: new Date(data.order.createdAt).toISOString().split('T')[0],
            time: new Date(data.order.createdAt).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            }),
            placeOfSupply: data.order.shippingState || '09-Uttar Pradesh',
            customerName: data.order.shippingName || data.order.user?.name || 'Valued Customer',
            customerAddress: [
              data.order.shippingLine1 || data.order.address?.line1,
              data.order.shippingLine2 || data.order.address?.line2,
              data.order.shippingCity || data.order.address?.city,
              data.order.shippingState || data.order.address?.state,
              data.order.shippingPincode || data.order.address?.pincode,
            ]
              .filter(Boolean)
              .join(', '),
            customerPhone: data.order.shippingPhone || data.order.user?.phone || 'N/A',
            customerState: data.order.shippingState || '09-Uttar Pradesh',
            customerGstin: data.order.customerGstin || '',
            items: data.order.items?.map((item: any) => ({
              itemName: item.productName || item.product?.name || 'Women Apparel',
              hsnSac: item.hsnCode || '6204',
              quantity: item.quantity,
              rate: Number(item.unitPrice || item.price || 0),
            })) || [],
            discount: Number(data.order.discount || 0),
            cgstRate: 2.5,
            sgstRate: 2.5,
          };

          setInvoiceData(formattedInvoice);
        }
      } catch (err) {
        console.error('Failed to fetch order invoice:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const handleDownloadPdf = async () => {
    if (!invoiceData) return;
    setIsDownloadingPdf(true);
    const filename = `PLT_Tax_Invoice_${invoiceData.invoiceNo}.pdf`;
    await exportInvoiceToPdf('plt-tax-invoice-bill', filename);
    setIsDownloadingPdf(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-neutral-900 py-8 px-4 sm:px-6 lg:px-8 print:p-0 print:bg-white">
      {/* HEADER CONTROLS (HIDDEN WHEN PRINTING) */}
      <div className="max-w-4xl mx-auto mb-6 print:hidden">
        <div className="flex items-center justify-between bg-white dark:bg-neutral-800 p-4 rounded-2xl border border-gray-200 dark:border-neutral-700 shadow-sm">
          <Link
            href="/account/orders"
            className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-brand-600 transition-colors"
          >
            <ArrowLeft size={18} />
            <span>Back to Orders</span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadPdf}
              disabled={isDownloadingPdf || !invoiceData}
              className="flex items-center gap-2 px-5 py-2.5 bg-black text-white dark:bg-white dark:text-black rounded-xl text-sm font-bold hover:opacity-90 transition-opacity shadow-sm disabled:opacity-50"
            >
              {isDownloadingPdf ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <Download size={16} />
                  <span>Download PDF</span>
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-neutral-700 text-gray-700 dark:text-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors shadow-sm"
            >
              <Printer size={16} />
              <span>Print</span>
            </button>
          </div>
        </div>
      </div>

      {/* TAX INVOICE PREVIEW */}
      <div className="w-full flex justify-center">
        {invoiceData ? (
          <TaxInvoice id="plt-tax-invoice-bill" data={invoiceData} isEditable={false} />
        ) : (
          <div className="bg-white dark:bg-neutral-800 p-12 rounded-2xl border text-center max-w-md">
            <FileText className="mx-auto text-gray-400 mb-3" size={48} />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Generating Tax Invoice...</h3>
            <p className="text-sm text-gray-500 mt-1">Fetching customer order details.</p>
          </div>
        )}
      </div>
    </div>
  );
}
