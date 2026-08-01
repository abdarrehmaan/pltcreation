'use client';

import React from 'react';
import { numberToWordsIN } from '@/lib/utils/numToWords';

export interface InvoiceItem {
  srNo?: number;
  itemName: string;
  hsnSac?: string;
  quantity: number | '';
  rate: number | '';
  amount?: number;
}

export interface InvoiceData {
  invoiceNo: string;
  date: string;
  time: string;
  placeOfSupply: string;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  customerState: string;
  customerGstin: string;
  items: InvoiceItem[];
  discount: number;
  shippingCharge?: number;
  grandTotal?: number;
  cgstRate: number; // default 2.5
  sgstRate: number; // default 2.5
  customNotes?: string;
  paymentMethod?: string;
  codAdvanceAmount?: number;
  paymentStatus?: string;
  razorpayPaymentId?: string;
}

interface TaxInvoiceProps {
  data: InvoiceData;
  isEditable?: boolean;
  onDataChange?: (data: InvoiceData) => void;
  id?: string;
}

export const defaultInvoiceData: InvoiceData = {
  invoiceNo: 'PLT-2026-0042',
  date: '2026-07-31',
  time: '10:30 AM',
  placeOfSupply: '09-Uttar Pradesh',
  customerName: 'Ayesha Khan',
  customerAddress: 'House 42, Civil Lines, Allahabad, Uttar Pradesh - 211001',
  customerPhone: '+91 98765 43210',
  customerState: '09-Uttar Pradesh',
  customerGstin: '09ABCDE1234F1Z5',
  items: [
    { itemName: 'Designer Embroidered Suit Set', hsnSac: '6204', quantity: 2, rate: 2450 },
    { itemName: 'Georgette Anarkali Dupatta Set', hsnSac: '6204', quantity: 1, rate: 3800 },
    { itemName: 'Silk Kurti with Plazo', hsnSac: '6204', quantity: 1, rate: 1950 },
  ],
  discount: 200,
  shippingCharge: 0,
  cgstRate: 2.5,
  sgstRate: 2.5,
};

export default function TaxInvoice({
  data,
  isEditable = false,
  onDataChange,
  id = 'plt-tax-invoice-bill',
}: TaxInvoiceProps) {
  // Ensure we have exactly 10 rows for official printed bill template fidelity
  const displayItems = [...data.items];
  while (displayItems.length < 10) {
    displayItems.push({ itemName: '', hsnSac: '', quantity: '', rate: '' });
  }

  // Calculations
  const calculatedItems = displayItems.map((item) => {
    const qty = typeof item.quantity === 'number' ? item.quantity : parseFloat(item.quantity as string) || 0;
    const rate = typeof item.rate === 'number' ? item.rate : parseFloat(item.rate as string) || 0;
    const amount = qty * rate;
    return { ...item, calculatedAmount: item.itemName ? amount : 0 };
  });

  const subtotal = calculatedItems.reduce((sum, item) => sum + item.calculatedAmount, 0);
  const discount = data.discount || 0;
  const amountAfterDiscount = Math.max(0, subtotal - discount);
  const shippingCharge = data.shippingCharge || 0;

  const cgstRate = typeof data.cgstRate === 'number' ? data.cgstRate : 2.5;
  const sgstRate = typeof data.sgstRate === 'number' ? data.sgstRate : 2.5;

  // For 5% inclusive GST (or cgstRate + sgstRate %), Taxable Base = Amount After Discount / (1 + totalTaxRate/100)
  const totalTaxPercent = cgstRate + sgstRate;
  const taxableAmount = totalTaxPercent > 0 ? amountAfterDiscount / (1 + totalTaxPercent / 100) : amountAfterDiscount;
  const cgstAmount = (taxableAmount * cgstRate) / 100;
  const sgstAmount = (taxableAmount * sgstRate) / 100;

  // Actual Payment Paid by Customer = Grand Total
  const grandTotal = typeof data.grandTotal === 'number' ? data.grandTotal : (amountAfterDiscount + shippingCharge);
  const grandTotalRounded = Math.round(grandTotal);

  const codAdvance = Number(data.codAdvanceAmount || 0);
  const isCod = data.paymentMethod === 'COD' || codAdvance > 0;
  const balanceDue = isCod ? Math.max(0, grandTotalRounded - codAdvance) : 0;
  const advancePercent = (isCod && grandTotalRounded > 0 && codAdvance > 0)
    ? Math.round((codAdvance / grandTotalRounded) * 100)
    : 0;

  const amountInWords = numberToWordsIN(grandTotalRounded);

  const handleInputChange = (field: keyof InvoiceData, value: any) => {
    if (onDataChange) {
      onDataChange({ ...data, [field]: value });
    }
  };

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: any) => {
    if (!onDataChange) return;
    const updatedItems = [...data.items];

    while (updatedItems.length <= index) {
      updatedItems.push({ itemName: '', hsnSac: '', quantity: '', rate: '' });
    }

    updatedItems[index] = { ...updatedItems[index], [field]: value };
    onDataChange({ ...data, items: updatedItems });
  };

  return (
    <div
      id={id}
      style={{ backgroundColor: '#ffffff', color: '#000000' }}
      className="plt-bill-container bg-white text-black font-sans w-full max-w-[820px] mx-auto p-4 border-2 border-black rounded shadow-lg select-text text-xs leading-snug print:p-0 print:border-2 print:border-black print:shadow-none print:max-w-none print:w-full"
    >
      {/* 1. TOP HEADER SECTION */}
      <div className="grid grid-cols-12 border-b-2 border-black pb-3">
        {/* COLORFUL OFFICIAL BRAND LOGO COLUMN */}
        <div className="col-span-3 flex items-center justify-center border-r-2 border-black pr-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="PLT Creation Official Logo"
            className="w-32 h-32 object-contain rounded-full border-2 border-amber-600/50 p-1 bg-amber-50/30 shadow-sm"
          />
        </div>

        {/* CENTER COMPANY DETAILS */}
        <div className="col-span-5 px-3 flex flex-col justify-between border-r-2 border-black">
          <div>
            <h1 className="font-serif text-2xl font-black tracking-wider text-black uppercase mb-1.5">
              PLT CREATION
            </h1>
            <div className="space-y-1 text-[11px]">
              <div className="flex items-center gap-2">
                <span className="text-[12px]">📅</span>
                <span className="font-bold">GSTIN</span>
                <span>:</span>
                <span className="font-mono font-bold text-xs tracking-wider">09FILPA0325L1Z9</span>
              </div>

              <div className="flex items-start gap-2">
                <span className="text-[12px] mt-0.5">📍</span>
                <div>
                  <span className="font-bold">Address</span>
                  <span> : </span>
                  <span className="font-medium">E 98/1 GTB Nagar,</span>
                  <br />
                  <span className="pl-0.5 font-medium">Kareli, Prayagraj - 211016</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pl-5">
                <span className="font-bold">State</span>
                <span>:</span>
                <span className="font-medium">09-Uttar Pradesh</span>
              </div>

              <div className="flex items-center gap-2 pt-0.5">
                <span className="text-[12px]">📞</span>
                <span className="font-bold">Phone</span>
                <span>:</span>
                <span className="font-bold font-mono">6392006081</span>
              </div>
            </div>
          </div>
        </div>

        {/* TAX INVOICE DETAILS RIGHT */}
        <div className="col-span-4 pl-3 flex flex-col justify-between">
          <div className="border-2 border-black rounded-2xl overflow-hidden mb-2 shadow-sm">
            <div className="bg-white text-black text-center font-extrabold py-1.5 text-sm tracking-widest uppercase flex items-center justify-center gap-2 border-b border-black">
              <span>TAX INVOICE</span>
              <span className="text-[10px]">❖</span>
            </div>
          </div>

          <div className="space-y-2 text-[11px]">
            <div className="flex items-center justify-between border-b border-gray-400 pb-0.5">
              <span className="font-bold w-24">Invoice No.</span>
              <span className="mx-1">:</span>
              {isEditable ? (
                <input
                  type="text"
                  value={data.invoiceNo}
                  onChange={(e) => handleInputChange('invoiceNo', e.target.value)}
                  className="w-full focus:outline-none font-mono font-bold bg-transparent"
                />
              ) : (
                <span className="font-mono font-bold flex-1 text-right">{data.invoiceNo}</span>
              )}
            </div>

            <div className="flex items-center justify-between border-b border-gray-400 pb-0.5">
              <span className="font-bold w-24">Date</span>
              <span className="mx-1">:</span>
              {isEditable ? (
                <input
                  type="date"
                  value={data.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className="w-full focus:outline-none bg-transparent"
                />
              ) : (
                <span className="flex-1 text-right font-medium" suppressHydrationWarning>{data.date}</span>
              )}
            </div>

            <div className="flex items-center justify-between border-b border-gray-400 pb-0.5">
              <span className="font-bold w-24">Time</span>
              <span className="mx-1">:</span>
              {isEditable ? (
                <input
                  type="text"
                  value={data.time}
                  onChange={(e) => handleInputChange('time', e.target.value)}
                  className="w-full focus:outline-none bg-transparent"
                />
              ) : (
                <span className="flex-1 text-right font-medium" suppressHydrationWarning>{data.time}</span>
              )}
            </div>

            <div className="flex items-center justify-between border-b border-gray-400 pb-0.5">
              <span className="font-bold w-24">Place of Supply</span>
              <span className="mx-1">:</span>
              {isEditable ? (
                <input
                  type="text"
                  value={data.placeOfSupply}
                  onChange={(e) => handleInputChange('placeOfSupply', e.target.value)}
                  className="w-full focus:outline-none bg-transparent"
                />
              ) : (
                <span className="flex-1 text-right font-medium">{data.placeOfSupply}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. BILL TO SECTION */}
      <div className="py-2 border-b-2 border-black">
        <div className="flex items-center mb-2">
          <div className="border-2 border-black rounded-r-full px-4 py-0.5 font-extrabold text-xs tracking-widest bg-white">
            BILL TO
          </div>
          <div className="flex-1 h-[2px] bg-black ml-1 relative">
            <span className="absolute right-0 -top-1 w-2.5 h-2.5 rounded-full bg-black"></span>
          </div>
        </div>

        <div className="space-y-2 pl-2 text-[11px]">
          <div className="flex items-center border-b border-gray-400 pb-0.5">
            <span className="w-28 font-bold text-gray-900">Customer Name</span>
            <span className="mr-2">:</span>
            {isEditable ? (
              <input
                type="text"
                value={data.customerName}
                onChange={(e) => handleInputChange('customerName', e.target.value)}
                className="w-full font-semibold focus:outline-none bg-transparent"
                placeholder="Enter customer name"
              />
            ) : (
              <span className="flex-1 font-semibold text-black">{data.customerName || '_____________________________________'}</span>
            )}
          </div>

          <div className="flex items-start border-b border-gray-400 pb-0.5">
            <span className="w-28 font-bold text-gray-900 pt-0.5">Address</span>
            <span className="mr-2 pt-0.5">:</span>
            {isEditable ? (
              <textarea
                rows={2}
                value={data.customerAddress}
                onChange={(e) => handleInputChange('customerAddress', e.target.value)}
                className="w-full focus:outline-none bg-transparent resize-none"
                placeholder="Enter address"
              />
            ) : (
              <span className="flex-1 text-black font-medium min-h-[1.75rem]">{data.customerAddress || '_____________________________________'}</span>
            )}
          </div>

          <div className="flex items-center border-b border-gray-400 pb-0.5">
            <span className="w-28 font-bold text-gray-900">Phone No.</span>
            <span className="mr-2">:</span>
            {isEditable ? (
              <input
                type="text"
                value={data.customerPhone}
                onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                className="w-full focus:outline-none bg-transparent"
              />
            ) : (
              <span className="flex-1 font-medium font-mono text-black">{data.customerPhone || '_____________________________________'}</span>
            )}
          </div>

          <div className="flex items-center border-b border-gray-400 pb-0.5">
            <span className="w-28 font-bold text-gray-900">State</span>
            <span className="mr-2">:</span>
            {isEditable ? (
              <input
                type="text"
                value={data.customerState}
                onChange={(e) => handleInputChange('customerState', e.target.value)}
                className="w-full focus:outline-none bg-transparent"
              />
            ) : (
              <span className="flex-1 font-medium text-black">{data.customerState || '_____________________________________'}</span>
            )}
          </div>

          <div className="flex items-center border-b border-gray-400 pb-0.5">
            <span className="w-28 font-bold text-gray-900">GSTIN</span>
            <span className="mr-2">:</span>
            {isEditable ? (
              <input
                type="text"
                value={data.customerGstin}
                onChange={(e) => handleInputChange('customerGstin', e.target.value)}
                className="w-full font-mono uppercase focus:outline-none bg-transparent"
              />
            ) : (
              <span className="flex-1 font-mono font-medium text-black">{data.customerGstin || '_____________________________________'}</span>
            )}
          </div>
        </div>
      </div>

      {/* 3. MAIN ITEMS TABLE */}
      <div className="w-full my-2 border-2 border-black overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="border-b-2 border-black bg-white text-center font-bold">
              <th className="w-12 py-2 border-r-2 border-black">Sr. No.</th>
              <th className="py-2 px-3 border-r-2 border-black text-left">Item Name</th>
              <th className="w-24 py-2 border-r-2 border-black">HSN / SAC</th>
              <th className="w-20 py-2 border-r-2 border-black">Quantity</th>
              <th className="w-24 py-2 border-r-2 border-black">Rate (₹)</th>
              <th className="w-28 py-2">Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            {calculatedItems.slice(0, 10).map((item, idx) => {
              const srNo = idx + 1;
              const hasContent = Boolean(item.itemName || item.quantity || item.rate);
              return (
                <tr key={idx} className="border-b border-black text-center h-8">
                  <td className="border-r-2 border-black font-semibold text-gray-800">{srNo}</td>
                  <td className="border-r-2 border-black text-left px-3 font-medium">
                    {isEditable ? (
                      <input
                        type="text"
                        value={item.itemName}
                        onChange={(e) => handleItemChange(idx, 'itemName', e.target.value)}
                        className="w-full focus:outline-none bg-transparent"
                      />
                    ) : (
                      <span>{item.itemName}</span>
                    )}
                  </td>
                  <td className="border-r-2 border-black font-mono">
                    {isEditable ? (
                      <input
                        type="text"
                        value={item.hsnSac}
                        onChange={(e) => handleItemChange(idx, 'hsnSac', e.target.value)}
                        className="w-full text-center focus:outline-none bg-transparent"
                      />
                    ) : (
                      <span>{item.hsnSac}</span>
                    )}
                  </td>
                  <td className="border-r-2 border-black font-semibold">
                    {isEditable ? (
                      <input
                        type="number"
                        min="0"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(idx, 'quantity', e.target.value ? Number(e.target.value) : '')}
                        className="w-full text-center focus:outline-none bg-transparent"
                      />
                    ) : (
                      <span>{item.quantity}</span>
                    )}
                  </td>
                  <td className="border-r-2 border-black text-right px-3 font-mono">
                    {isEditable ? (
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.rate}
                        onChange={(e) => handleItemChange(idx, 'rate', e.target.value ? Number(e.target.value) : '')}
                        className="w-full text-right focus:outline-none bg-transparent"
                      />
                    ) : (
                      <span>{item.rate !== '' ? Number(item.rate).toFixed(2) : ''}</span>
                    )}
                  </td>
                  <td className="text-right px-3 font-mono font-semibold">
                    {hasContent ? item.calculatedAmount.toFixed(2) : ''}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 4. LOWER CALCULATIONS & AMOUNT IN WORDS SECTION */}
      <div className="grid grid-cols-12 gap-3 my-2 items-start">
        {/* LEFT COLUMN: AMOUNT IN WORDS & COD PAYMENT NOTICE */}
        <div className="col-span-7 flex flex-col justify-between h-full pt-1">
          <div className="border border-black p-2 rounded bg-white min-h-[3rem] flex items-center">
            <div className="flex items-start gap-1.5 text-xs w-full">
              <span className="font-bold whitespace-nowrap">Amount in Words</span>
              <span className="font-bold">:</span>
              <span className="font-semibold text-black underline decoration-dotted capitalize flex-1 border-b border-gray-400 pb-0.5">
                {amountInWords}
              </span>
            </div>
          </div>

          {codAdvance > 0 ? (
            <div className="border-2 border-black p-2 rounded bg-white text-[11px] space-y-1 my-1">
              <div className="font-extrabold uppercase tracking-wider text-black flex items-center justify-between border-b border-black pb-1">
                <span>COD Payment Details</span>
                <span className="bg-black text-white px-1.5 py-0.5 rounded text-[9px] font-bold">
                  {advancePercent > 0 ? `${advancePercent}% ADVANCE PAID` : 'ADVANCE PAID'}
                </span>
              </div>
              <div className="flex items-center justify-between font-semibold">
                <span>Online Advance Paid:</span>
                <span className="font-mono font-bold">₹{codAdvance.toFixed(2)}</span>
              </div>
              {data.razorpayPaymentId && (
                <div className="flex items-center justify-between text-[10px] text-gray-700">
                  <span>Razorpay Payment Ref:</span>
                  <span className="font-mono font-semibold">{data.razorpayPaymentId}</span>
                </div>
              )}
              <div className="flex items-center justify-between font-black text-xs pt-1 border-t border-black text-black">
                <span>Balance to Collect on Delivery:</span>
                <span className="font-mono text-sm font-bold">₹{balanceDue.toFixed(2)}</span>
              </div>
            </div>
          ) : (
            isCod && (
              <div className="border-2 border-black p-2 rounded bg-white text-[11px] my-1">
                <span className="font-bold uppercase tracking-wider">Payment Mode: </span>
                <span className="font-semibold">Cash On Delivery (COD) - Collect ₹{balanceDue.toFixed(2)} on Delivery</span>
              </div>
            )
          )}
        </div>

        {/* RIGHT COLUMN: SUBTOTAL & TAX SUMMARY BOX */}
        <div className="col-span-5 border-2 border-black rounded overflow-hidden text-xs">
          <div className="divide-y divide-black">
            <div className="flex items-center justify-between p-1.5">
              <span className="font-semibold">Subtotal</span>
              <div className="flex items-center">
                <span className="mr-1">₹</span>
                <span className="font-mono font-semibold border-b border-gray-400 min-w-[80px] text-right">
                  {subtotal.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between p-1.5">
              <span className="font-semibold">Discount</span>
              <div className="flex items-center">
                <span className="mr-1">₹</span>
                {isEditable ? (
                  <input
                    type="number"
                    min="0"
                    value={data.discount}
                    onChange={(e) => handleInputChange('discount', Number(e.target.value))}
                    className="font-mono font-semibold border-b border-gray-400 min-w-[80px] text-right focus:outline-none bg-transparent"
                  />
                ) : (
                  <span className="font-mono font-semibold border-b border-gray-400 min-w-[80px] text-right">
                    {discount.toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between p-1.5">
              <span className="font-semibold">Taxable Value (Excl. GST)</span>
              <div className="flex items-center">
                <span className="mr-1">₹</span>
                <span className="font-mono font-semibold border-b border-gray-400 min-w-[80px] text-right">
                  {taxableAmount.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between p-1.5">
              <span className="font-semibold">CGST ({cgstRate}%)</span>
              <div className="flex items-center">
                <span className="mr-1">₹</span>
                <span className="font-mono font-semibold border-b border-gray-400 min-w-[80px] text-right">
                  {cgstAmount.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between p-1.5">
              <div className="flex flex-col">
                <span className="font-semibold">SGST ({sgstRate}%)</span>
                <span className="text-[9px] text-gray-600">(or IGST, if applicable)</span>
              </div>
              <div className="flex items-center">
                <span className="mr-1">₹</span>
                <span className="font-mono font-semibold border-b border-gray-400 min-w-[80px] text-right">
                  {sgstAmount.toFixed(2)}
                </span>
              </div>
            </div>

            {shippingCharge > 0 && (
              <div className="flex items-center justify-between p-1.5">
                <span className="font-semibold">Delivery Charges</span>
                <div className="flex items-center">
                  <span className="mr-1">₹</span>
                  <span className="font-mono font-semibold border-b border-gray-400 min-w-[80px] text-right">
                    {shippingCharge.toFixed(2)}
                  </span>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between p-2 bg-white text-black font-black text-sm border-t-2 border-black">
              <span className="tracking-wider uppercase">GRAND TOTAL</span>
              <div className="flex items-center">
                <span className="mr-1">₹</span>
                <span className="font-mono text-base font-bold border-b-2 border-black">
                  {grandTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {codAdvance > 0 && (
              <>
                <div className="flex items-center justify-between p-1.5 font-semibold text-xs border-t border-black">
                  <span>Less: {advancePercent > 0 ? `${advancePercent}% ` : ''}Advance Paid</span>
                  <div className="flex items-center font-mono">
                    <span className="mr-1">- ₹</span>
                    <span>{codAdvance.toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-2 bg-white text-black font-black text-xs border-t-2 border-black">
                  <span className="tracking-wider uppercase">BALANCE ON DELIVERY</span>
                  <div className="flex items-center">
                    <span className="mr-1">₹</span>
                    <span className="font-mono text-sm font-bold border-b-2 border-black">
                      {balanceDue.toFixed(2)}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 5. FOOTER SECTION: TERMS & SIGNATURE */}
      <div className="grid grid-cols-12 gap-3 pt-3 border-t-2 border-black items-end">
        {/* TERMS & CONDITIONS LEFT */}
        <div className="col-span-7">
          <div className="flex items-center mb-1.5">
            <div className="border-2 border-black rounded-r-full px-3 py-0.5 font-extrabold text-[11px] uppercase tracking-wider bg-white">
              TERMS & CONDITIONS
            </div>
            <div className="flex-1 h-[2px] bg-black ml-1 relative">
              <span className="absolute right-0 -top-1 w-2.5 h-2.5 rounded-full bg-black"></span>
            </div>
          </div>

          <ol className="list-decimal list-inside text-[10.5px] space-y-1 text-gray-900 leading-snug font-medium pl-1">
            <li>No exchange and no return.</li>
            <li>For any kind of Product issue an unboxing 360 degree video is mandatory.</li>
            <li>All Subject to Allahabad Jurisdiction only.</li>
          </ol>
        </div>

        {/* SIGNATURE RIGHT */}
        <div className="col-span-5 text-right flex flex-col items-end">
          <span className="font-bold text-xs tracking-wider uppercase mb-1 text-black">For PLT CREATION</span>

          {/* AUTHENTIC HANDWRITTEN SIGNATURE MATCHING BILL BOOK */}
          <div className="w-48 h-16 flex items-center justify-center my-0.5 select-none overflow-hidden">
            <svg viewBox="0 0 240 85" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <g transform="rotate(-5, 120, 42)">
                {/* Handwritten Cursive "Hifza Ansar" Signature */}
                <text
                  x="28"
                  y="46"
                  fontFamily="'Dancing Script', 'Caveat', 'Brush Script MT', 'Great Vibes', cursive"
                  fontSize="35"
                  fontWeight="bold"
                  fontStyle="italic"
                  fill="#000000"
                  stroke="#000000"
                  strokeWidth="0.4"
                  letterSpacing="0.5px"
                >
                  Hifza Ansar
                </text>

                {/* Double Underline Strokes beneath Ansar */}
                <line x1="125" y1="52" x2="175" y2="43" stroke="#000000" strokeWidth="2.2" strokeLinecap="round" />
                <line x1="128" y1="56" x2="178" y2="47" stroke="#000000" strokeWidth="2.2" strokeLinecap="round" />

                {/* Signature Dot to the right */}
                <circle cx="186" cy="46" r="2.5" fill="#000000" />
              </g>
            </svg>
          </div>

          <div className="w-48 border-t-2 border-black pt-1 text-center">
            <span className="text-[11px] font-bold text-gray-900">Authorized Signatory</span>
          </div>
        </div>
      </div>
    </div>
  );
}
