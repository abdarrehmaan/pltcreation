'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import TaxInvoice, { defaultInvoiceData, InvoiceData } from '@/components/invoice/TaxInvoice';
import { exportInvoiceToPdf } from '@/lib/utils/pdfExport';
import { Printer, Download, Search, Sparkles, CheckCircle2, FileText, Loader2 } from 'lucide-react';

function InvoiceContent() {
  const searchParams = useSearchParams();
  const queryParam = searchParams?.get('query') || searchParams?.get('q') || searchParams?.get('orderNumber') || searchParams?.get('phone');

  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);

  // Customer search / fetch state
  const [searchQuery, setSearchQuery] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [isLoadingInitial, setIsLoadingInitial] = useState(Boolean(queryParam));
  const [fetchMessage, setFetchMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // PDF Download state
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  const fetchOrderDetails = async (queryToFetch: string) => {
    if (!queryToFetch.trim()) return;

    setIsFetching(true);
    setFetchMessage(null);

    try {
      const res = await fetch(`/api/orders/fetch?query=${encodeURIComponent(queryToFetch.trim())}`);
      const data = await res.json();

      if (!res.ok || !data.order) {
        setFetchMessage({ type: 'error', text: data.error || 'Order not found.' });
        setInvoiceData(null);
        setIsFetching(false);
        setIsLoadingInitial(false);
        return;
      }

      const ord = data.order;
      const formattedItems = (ord.items || []).map((item: any) => ({
        itemName: item.productName || item.product?.name || item.name || 'Women Apparel',
        hsnSac: '',
        quantity: item.quantity || 1,
        rate: Number(item.unitPrice || item.price || 0),
      }));

      const createdDate = ord.createdAt ? new Date(ord.createdAt) : new Date();

      const newInvoice: InvoiceData = {
        invoiceNo: ord.orderNumber || `PLT-${(ord.id || '2026-0042').substring(0, 8).toUpperCase()}`,
        date: createdDate.toISOString().split('T')[0],
        time: createdDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
        placeOfSupply: ord.shippingState || ord.address?.state || '09-Uttar Pradesh',
        customerName: ord.shippingName || ord.user?.name || ord.customerName || 'Valued Customer',
        customerAddress: [
          ord.shippingLine1 || ord.address?.line1,
          ord.shippingLine2 || ord.address?.line2,
          ord.shippingCity || ord.address?.city,
          ord.shippingState || ord.address?.state,
          ord.shippingPincode || ord.address?.pincode,
        ]
          .filter(Boolean)
          .join(', ') || 'Prayagraj, Uttar Pradesh',
        customerPhone: ord.shippingPhone || ord.user?.phone || queryToFetch,
        customerState: ord.shippingState || ord.address?.state || '09-Uttar Pradesh',
        customerGstin: ord.customerGstin || '',
        items: formattedItems.length > 0 ? formattedItems : [],
        discount: Number(ord.discount || 0) + Number(ord.couponDiscount || 0) + Number(ord.prepaidDiscount || 0),
        shippingCharge: Number(ord.shippingCharge || ord.shipping || 0),
        grandTotal: Number(ord.total || 0) > 0 ? Number(ord.total) : undefined,
        cgstRate: 2.5,
        sgstRate: 2.5,
        paymentMethod: ord.paymentMethod,
        codAdvanceAmount: Number(ord.codAdvanceAmount || 0),
        paymentStatus: ord.paymentStatus,
        razorpayPaymentId: ord.razorpayPaymentId || undefined,
      };

      setInvoiceData(newInvoice);
      setFetchMessage({
        type: 'success',
        text: `Order ${newInvoice.invoiceNo} details loaded!`,
      });
    } catch (err) {
      console.error('Error fetching order details:', err);
      setFetchMessage({ type: 'error', text: 'Network error fetching order details.' });
    } finally {
      setIsFetching(false);
      setIsLoadingInitial(false);
    }
  };

  // Auto-fetch if query URL param is present
  useEffect(() => {
    if (queryParam) {
      setSearchQuery(queryParam);
      fetchOrderDetails(queryParam);
    } else {
      setIsLoadingInitial(false);
    }
  }, [queryParam]);

  const handleFetchOrder = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) {
      setFetchMessage({ type: 'error', text: 'Please enter an Order Number or Phone Number.' });
      return;
    }
    await fetchOrderDetails(searchQuery);
  };

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
      {/* TOP CONTROLS HEADER (HIDDEN WHEN PRINTING) */}
      <div className="max-w-4xl mx-auto mb-6 print:hidden">
        <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-md border border-gray-200 dark:border-neutral-700 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-neutral-700">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="text-amber-500" size={24} />
                <h1 className="text-2xl font-extrabold font-serif text-gray-900 dark:text-white tracking-wide">
                  PLT Creation Tax Invoice
                </h1>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Official GST Tax Invoice - Fetch customer details & download high-res PDF
              </p>
            </div>

            {/* MAIN PDF & PRINT ACTIONS ONLY */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleDownloadPdf}
                disabled={isDownloadingPdf || !invoiceData}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 shadow-md hover:shadow-lg transition-all disabled:opacity-50"
              >
                {isDownloadingPdf ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Generating PDF...</span>
                  </>
                ) : (
                  <>
                    <Download size={18} />
                    <span>Download PDF</span>
                  </>
                )}
              </button>

              <button
                onClick={handlePrint}
                disabled={!invoiceData}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm bg-gray-100 dark:bg-neutral-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-neutral-600 transition-all disabled:opacity-50"
              >
                <Printer size={18} />
                <span>Print</span>
              </button>
            </div>
          </div>

          {/* SEARCH ORDER BAR */}
          <div className="bg-amber-50 dark:bg-neutral-950 p-4 rounded-xl border border-amber-200 dark:border-neutral-800">
            <h3 className="text-xs font-bold text-amber-900 dark:text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Search size={14} />
              Look Up Order Details
            </h3>
            <form onSubmit={handleFetchOrder} className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter Order No (e.g. PLT-2026-0042) or Phone Number..."
                  className="w-full pl-3 pr-10 py-2 rounded-xl text-sm border border-amber-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <button
                type="submit"
                disabled={isFetching}
                className="w-full sm:w-auto px-5 py-2 rounded-xl font-semibold text-sm bg-gradient-to-r from-red-700 to-rose-900 text-white hover:from-red-800 hover:to-rose-950 transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
              >
                {isFetching ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Fetching...</span>
                  </>
                ) : (
                  <>
                    <FileText size={16} />
                    <span>Fetch Details</span>
                  </>
                )}
              </button>
            </form>

            {fetchMessage && (
              <div
                className={`mt-2 text-xs font-semibold flex items-center gap-1.5 ${
                  fetchMessage.type === 'success' ? 'text-green-700 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}
              >
                {fetchMessage.type === 'success' && <CheckCircle2 size={14} />}
                <span>{fetchMessage.text}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* READ-ONLY OFFICIAL TAX INVOICE PREVIEW / LOADING / EMPTY STATE */}
      <div className="w-full flex justify-center overflow-x-auto py-2">
        {isFetching || isLoadingInitial ? (
          <div className="bg-white dark:bg-neutral-800 p-12 rounded-2xl border border-gray-200 dark:border-neutral-700 shadow-md text-center max-w-md w-full my-8 space-y-4">
            <div className="w-14 h-14 rounded-full bg-amber-50 dark:bg-neutral-900 border border-amber-200 dark:border-neutral-700 flex items-center justify-center mx-auto">
              <Loader2 className="animate-spin text-amber-600 dark:text-amber-400" size={28} />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">Generating Tax Invoice...</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Fetching order details & calculating GST breakdown.</p>
            </div>
          </div>
        ) : invoiceData ? (
          <TaxInvoice
            id="plt-tax-invoice-bill"
            data={invoiceData}
            isEditable={false}
          />
        ) : (
          <div className="bg-white dark:bg-neutral-800 p-12 rounded-2xl border border-gray-200 dark:border-neutral-700 shadow-sm text-center max-w-md w-full my-8 space-y-3">
            <FileText className="mx-auto text-amber-600/60 dark:text-amber-400/60" size={42} />
            <h3 className="text-base font-bold text-gray-900 dark:text-white">No Invoice Loaded Yet</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Enter an Order Number or Phone Number above to generate and view the GST Tax Invoice.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function InvoicePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center space-y-3 bg-gray-100 dark:bg-neutral-900">
        <Loader2 className="animate-spin text-amber-600" size={36} />
        <p className="text-sm font-medium text-gray-500">Loading Tax Invoice...</p>
      </div>
    }>
      <InvoiceContent />
    </Suspense>
  );
}
