// Customer Account Hub & Profile Management Page (/account)

import { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CustomerProfileView } from '../components/CustomerProfileView';
import { CustomerInvoicesView } from '../components/CustomerInvoicesView';
import { CustomerSecurityView } from '../components/CustomerSecurityView';
import { CustomerOrderHistoryView } from '../../module3_order/components/CustomerOrderHistoryView';
import { InvoiceModal } from '../components/InvoiceModal';
import { InvoiceRecord } from '../types';
import { User, FileText, Shield, LogOut, ArrowRight, Package } from 'lucide-react';

type TabType = 'profile' | 'orders' | 'invoices' | 'security';

export default function AccountPage() {
  const { user, customerProfile, isAuthenticated, isLoading, logout, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceRecord | null>(null);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-xs uppercase tracking-widest text-zinc-500 animate-pulse">
          Loading Account Profile...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/account/login" replace />;
  }

  const isStaff = user?.role === 'STORE_STAFF' || user?.role === 'ADMIN' || user?.role === 'MANAGER';
  const customerName = customerProfile
    ? `${customerProfile.firstName} ${customerProfile.lastName}`
    : user?.email.split('@')[0] || 'Customer';

  return (
    <div className="w-full bg-zinc-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8 text-[#0a0a0a]">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Staff Clearance Notice if viewing as staff */}
        {isStaff && (
          <div className="bg-zinc-100 border border-zinc-300 text-zinc-900 rounded p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold uppercase tracking-wider bg-black text-white px-2 py-0.5 rounded text-[10px]">
                {user?.role} Access
              </span>
              <span>You have administrative clearance. You can manage store staff, customers, and view trends in the back-office.</span>
            </div>
            <Link
              to="/admin"
              className="inline-flex items-center gap-1 font-semibold text-black underline hover:no-underline shrink-0"
            >
              <span>Go to Admin Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* Account Header Banner */}
        <div className="bg-white border border-zinc-200 rounded-sm p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-[10px] uppercase tracking-widest font-semibold text-zinc-500">
              D&apos;fine Member Account
            </div>
            <h1 className="font-serif text-3xl font-medium text-[#0a0a0a] mt-1">
              Welcome back, {customerName}
            </h1>
            <p className="text-xs text-zinc-500 mt-1">
              Member Email: <span className="font-mono text-[#0a0a0a]">{user?.email}</span> • Status:{' '}
              <span className="text-black font-semibold bg-zinc-100 border border-zinc-200 px-1.5 py-0.5 rounded text-[11px]">{user?.accountStatus}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => logout()}
              className="flex items-center gap-1.5 px-4 py-2 border border-zinc-300 hover:border-black text-xs font-semibold text-zinc-800 rounded transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-zinc-200 bg-white px-2 sm:px-6 rounded-t-sm">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 py-3.5 px-4 text-xs uppercase tracking-wider font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'profile'
                ? 'border-black text-black'
                : 'border-transparent text-zinc-500 hover:text-black'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile & Addresses</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 py-3.5 px-4 text-xs uppercase tracking-wider font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'orders'
                ? 'border-black text-black'
                : 'border-transparent text-zinc-500 hover:text-black'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>My Orders & Tracking</span>
          </button>

          <button
            onClick={() => setActiveTab('invoices')}
            className={`flex items-center gap-2 py-3.5 px-4 text-xs uppercase tracking-wider font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'invoices'
                ? 'border-black text-black'
                : 'border-transparent text-zinc-500 hover:text-black'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Tax Invoices</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-2 py-3.5 px-4 text-xs uppercase tracking-wider font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'security'
                ? 'border-black text-black'
                : 'border-transparent text-zinc-500 hover:text-black'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Security & Sessions</span>
          </button>
        </div>

        {/* Tab Content Panels */}
        <div>
          {activeTab === 'profile' && (
            <CustomerProfileView profile={customerProfile} onUpdate={updateProfile} />
          )}

          {activeTab === 'orders' && (
            <CustomerOrderHistoryView customerId={customerProfile?.customerId || 1} />
          )}

          {activeTab === 'invoices' && (
            <CustomerInvoicesView
              customerEmail={user?.email}
              onSelectInvoice={inv => setSelectedInvoice(inv)}
            />
          )}

          {activeTab === 'security' && <CustomerSecurityView customerEmail={user?.email} />}
        </div>
      </div>

      {/* Official Tax Invoice Modal */}
      <InvoiceModal
        invoice={selectedInvoice}
        isOpen={!!selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
      />
    </div>
  );
}
