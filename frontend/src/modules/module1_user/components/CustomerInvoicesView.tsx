// Customer Invoices & Billing History View

import { useState, useEffect } from 'react';
import { InvoiceRecord } from '../types';
import { module1Api } from '../api/module1ApiClient';
import { FileText, ExternalLink, Calendar, CreditCard, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CustomerInvoicesViewProps {
  customerEmail?: string;
  onSelectInvoice: (invoice: InvoiceRecord) => void;
}

export function CustomerInvoicesView({ customerEmail, onSelectInvoice }: CustomerInvoicesViewProps) {
  const [invoices, setInvoices] = useState<InvoiceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInvoices() {
      setLoading(true);
      try {
        const data = await module1Api.getMyInvoices(customerEmail);
        setInvoices(data);
      } finally {
        setLoading(false);
      }
    }
    fetchInvoices();
  }, [customerEmail]);

  if (loading) {
    return (
      <div className="bg-white border border-zinc-200 rounded-none p-12 text-center">
        <div className="text-xs uppercase tracking-widest text-zinc-500 animate-pulse">
          Loading billing records...
        </div>
      </div>
    );
  }

  if (invoices.length === 0) {
    return (
      <div className="bg-white border border-zinc-200 rounded-none p-12 text-center">
        <ShoppingBag className="w-10 h-10 text-zinc-300 mx-auto mb-3" />
        <h3 className="font-serif text-lg text-[#0a0a0a] mb-1">No Orders or Invoices Found</h3>
        <p className="text-xs text-zinc-500 max-w-sm mx-auto mb-6">
          You haven&apos;t placed any orders yet. Once an order is confirmed, your legal tax invoice and receipt will appear here.
        </p>
        <Link
          to="/collections/all"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-black hover:bg-zinc-800 text-white text-xs uppercase tracking-widest font-medium rounded-none transition-colors"
        >
          Explore Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white border border-zinc-200 rounded-none p-6 sm:p-8">
      <div className="border-b border-zinc-200 pb-4 mb-6">
        <h2 className="font-serif text-2xl text-[#0a0a0a]">Orders & Tax Invoices</h2>
        <p className="text-xs text-zinc-500 mt-1">
          Review official purchase receipts, items breakdown, and tax invoices generated for your account.
        </p>
      </div>

      <div className="space-y-4">
        {invoices.map(inv => {
          const formattedDate = new Date(inv.issuedAt).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          });

          return (
            <div
              key={inv.invoiceId}
              className="border border-zinc-200 hover:border-black rounded-none p-4 sm:p-5 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="font-mono text-sm font-bold text-[#0a0a0a]">
                    {inv.invoiceNumber}
                  </span>
                  <span className="text-[10px] bg-zinc-100 text-zinc-900 border border-zinc-200 font-medium px-2 py-0.5 rounded-none">
                    {inv.paymentStatus}
                  </span>
                  <span className="text-xs text-zinc-500">Order #{inv.orderId}</span>
                </div>

                <div className="flex items-center gap-4 text-xs text-zinc-500 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                    {formattedDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <CreditCard className="w-3.5 h-3.5 text-zinc-500" />
                    {inv.paymentMethod}
                  </span>
                  <span>
                    {inv.items.length} {inv.items.length === 1 ? 'item' : 'items'}
                  </span>
                </div>

                <div className="text-xs text-zinc-600 font-serif">
                  Total Paid:{' '}
                  <span className="font-bold text-[#0a0a0a]">
                    LKR {inv.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-100">
                <button
                  onClick={() => onSelectInvoice(inv)}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-black hover:bg-zinc-800 text-white text-xs uppercase tracking-wider font-medium rounded-none transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>View Invoice</span>
                </button>
                <Link
                  to={`/invoices/${inv.invoiceNumber}`}
                  className="p-2 border border-zinc-300 hover:bg-zinc-100 text-zinc-700 rounded-none transition-colors"
                  title="Open standalone printable page"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
