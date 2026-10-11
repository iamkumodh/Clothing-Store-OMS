// Standalone Dedicated Tax Invoice Printable Route (/invoices/:invoiceNumber)

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { InvoiceRecord } from '../types';
import { module1Api } from '../api/module1ApiClient';
import { ArrowLeft, Printer, AlertCircle } from 'lucide-react';
import { InvoiceModal } from '../components/InvoiceModal';

export default function InvoicePrintPage() {
  const { invoiceNumber } = useParams<{ invoiceNumber: string }>();
  const [invoice, setInvoice] = useState<InvoiceRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInvoice() {
      if (!invoiceNumber) return;
      setLoading(true);
      try {
        const found = await module1Api.getInvoiceByNumber(invoiceNumber);
        setInvoice(found);
      } finally {
        setLoading(false);
      }
    }
    loadInvoice();
  }, [invoiceNumber]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-xs uppercase tracking-widest text-zinc-500 animate-pulse">
          Loading Invoice Document...
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
        <h1 className="font-serif text-2xl text-[#0a0a0a] mb-2">Invoice Not Found</h1>
        <p className="text-xs text-zinc-500 mb-6">
          We could not locate an official billing invoice matching serial number{' '}
          <span className="font-mono font-bold text-[#0a0a0a]">{invoiceNumber}</span>.
        </p>
        <Link
          to="/account"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white text-xs uppercase tracking-wider font-medium rounded-none hover:bg-zinc-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to My Account</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full bg-zinc-100 min-h-screen py-8 px-4 sm:px-6 print:p-0 print:bg-white">
      {/* Top Action Bar (Hidden during print) */}
      <div className="max-w-3xl mx-auto mb-6 flex items-center justify-between print:hidden">
        <Link
          to="/account"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-600 hover:text-black transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Account</span>
        </Link>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 px-4 py-2 bg-black hover:bg-zinc-800 text-white text-xs uppercase tracking-wider font-medium rounded-none transition-colors"
        >
          <Printer className="w-4 h-4" />
          <span>Print Document</span>
        </button>
      </div>

      {/* Render the printable invoice card */}
      <div className="max-w-3xl mx-auto">
        <InvoiceModal invoice={invoice} isOpen={true} onClose={() => {}} />
      </div>
    </div>
  );
}
