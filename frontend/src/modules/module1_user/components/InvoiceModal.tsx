// Official Tax Invoice Modal with Native Print Support

import React from 'react';
import { InvoiceRecord } from '../types';
import { Printer, X, CheckCircle } from 'lucide-react';

interface InvoiceModalProps {
  invoice: InvoiceRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export function InvoiceModal({ invoice, isOpen, onClose }: InvoiceModalProps) {
  if (!isOpen || !invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date(invoice.issuedAt).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 print:p-0 print:bg-white print:static">
      <div className="relative w-full max-w-3xl bg-white text-[#0a0a0a] shadow-2xl rounded-none border border-zinc-200 print:border-none print:shadow-none print:max-w-none">
        {/* Modal Top Bar (Hidden on print) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 bg-zinc-50 print:hidden">
          <div className="flex items-center gap-2">
            <span className="font-serif text-lg font-medium text-[#0a0a0a]">
              Official Tax Invoice
            </span>
            <span className="text-xs bg-zinc-100 text-zinc-900 border border-zinc-200 font-medium px-2 py-0.5 rounded-none">
              {invoice.paymentStatus}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-black hover:bg-zinc-800 text-white text-xs uppercase tracking-wider font-medium rounded-none transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-zinc-500 hover:text-black transition-colors"
              aria-label="Close invoice"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Document Body */}
        <div className="p-8 sm:p-10 font-sans print:p-8" id="printable-invoice">
          {/* Company Branding & Meta */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-zinc-200 pb-8">
            <div>
              <div className="font-serif text-3xl font-bold tracking-tight text-[#0a0a0a]">
                D&apos;FINE
              </div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-zinc-500 font-medium mt-1">
                Luxury Retail Clothing Store
              </div>
              <div className="text-xs text-zinc-600 mt-3 space-y-0.5 leading-relaxed">
                <div>D&apos;fine Retail (Pvt) Ltd</div>
                <div>No. 18, Galle Face Terrace, Colombo 03, Sri Lanka</div>
                <div>VAT / TIN: 1025102762-7000 • Reg: PV-98124</div>
                <div>support@dfine.lk • +94 11 234 5678</div>
              </div>
            </div>

            <div className="text-left sm:text-right space-y-1">
              <div className="text-xs uppercase tracking-wider font-semibold text-zinc-500">
                Tax Invoice / Receipt
              </div>
              <div className="font-mono text-xl font-bold text-[#0a0a0a]">
                {invoice.invoiceNumber}
              </div>
              <div className="text-xs text-zinc-600">
                Order Reference: <span className="font-mono font-medium">#{invoice.orderId}</span>
              </div>
              <div className="text-xs text-zinc-600">
                Issue Date: <span className="font-medium">{formattedDate}</span>
              </div>
              <div className="inline-flex items-center gap-1 text-xs text-zinc-900 font-medium bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded-none mt-1">
                <CheckCircle className="w-3.5 h-3.5 text-zinc-900" />
                <span>Payment Confirmed</span>
              </div>
            </div>
          </div>

          {/* Customer & Shipping Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 border-b border-zinc-200 text-xs">
            <div>
              <div className="text-[11px] uppercase tracking-wider font-bold text-zinc-500 mb-1.5">
                Billed To
              </div>
              <div className="font-semibold text-sm text-[#0a0a0a]">{invoice.customerName}</div>
              <div className="text-zinc-600">{invoice.customerEmail}</div>
              <div className="text-zinc-600 mt-1">{invoice.shippingAddress}</div>
              <div className="text-zinc-600">
                {invoice.city}, {invoice.district} District
              </div>
              <div className="text-zinc-600">
                {invoice.province} Province {invoice.postalCode ? `(${invoice.postalCode})` : ''}
              </div>
            </div>

            <div className="sm:text-right">
              <div className="text-[11px] uppercase tracking-wider font-bold text-zinc-500 mb-1.5">
                Payment & Fulfillment
              </div>
              <div className="text-zinc-600">
                Method: <span className="font-medium text-[#0a0a0a]">{invoice.paymentMethod}</span>
              </div>
              <div className="text-zinc-600">
                Status: <span className="font-semibold text-zinc-900">{invoice.paymentStatus}</span>
              </div>
              <div className="text-zinc-600 mt-1">
                Currency: <span className="font-medium text-[#0a0a0a]">LKR (Sri Lankan Rupee)</span>
              </div>
            </div>
          </div>

          {/* Itemized Line Items Table */}
          <div className="py-6 border-b border-zinc-200">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-200 text-[11px] uppercase tracking-wider text-zinc-500">
                  <th className="py-2.5 font-semibold">Item & Description</th>
                  <th className="py-2.5 font-semibold">SKU</th>
                  <th className="py-2.5 font-semibold text-center">Qty</th>
                  <th className="py-2.5 font-semibold text-right">Unit Price</th>
                  <th className="py-2.5 font-semibold text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {invoice.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-zinc-50 transition-colors">
                    <td className="py-3 pr-2">
                      <div className="font-medium text-[#0a0a0a]">{item.productName}</div>
                      {(item.color || item.size) && (
                        <div className="text-[11px] text-zinc-500">
                          {[item.color, item.size && `Size ${item.size}`].filter(Boolean).join(' • ')}
                        </div>
                      )}
                    </td>
                    <td className="py-3 font-mono text-[11px] text-zinc-600">{item.sku}</td>
                    <td className="py-3 text-center font-medium">{item.quantity}</td>
                    <td className="py-3 text-right text-zinc-600">
                      LKR {item.unitPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 text-right font-medium text-[#0a0a0a]">
                      LKR {item.subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Summary */}
          <div className="flex justify-end py-6 border-b border-zinc-200">
            <div className="w-full sm:w-72 space-y-2 text-xs">
              <div className="flex justify-between text-zinc-600">
                <span>Items Subtotal:</span>
                <span className="font-medium text-[#0a0a0a]">
                  LKR {invoice.subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span>Delivery / Courier Fee:</span>
                <span className="font-medium text-[#0a0a0a]">
                  LKR {invoice.shippingFee.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span>VAT / Sales Tax (0%):</span>
                <span className="font-medium text-[#0a0a0a]">LKR 0.00</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#0a0a0a] border-t border-zinc-200 pt-2">
                <span>Grand Total:</span>
                <span>
                  LKR {invoice.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          {/* Official Verification Footer */}
          <div className="pt-6 text-[11px] text-zinc-500 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              Generated electronically by D&apos;fine Clothing Store Order Management System.
            </div>
            <div className="font-mono text-[10px]">
              Assigned Module: User Profile & Invoices
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions (Hidden on print) */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-zinc-200 bg-zinc-50 print:hidden">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-zinc-300 text-xs font-medium text-zinc-700 hover:bg-zinc-100 rounded-none transition-colors"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 bg-black hover:bg-zinc-800 text-white text-xs uppercase tracking-wider font-medium rounded-none transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Invoice</span>
          </button>
        </div>
      </div>
    </div>
  );
}
