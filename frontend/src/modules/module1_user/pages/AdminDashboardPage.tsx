// admin dashboard layout for back-office management

import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Module 1 Components
import { AnalyticsDashboardView } from '../components/AnalyticsDashboardView';
import { StaffManagementView } from '../components/StaffManagementView';
import { CustomerDirectoryView } from '../components/CustomerDirectoryView';
import { SecurityAuditView } from '../components/SecurityAuditView';

// Module 2 Components
import { ProductCatalogView } from '../../module2_product/components/ProductCatalogView';
import { VariantInventoryView } from '../../module2_product/components/VariantInventoryView';
import { RestockHistoryView } from '../../module2_product/components/RestockLogModal';
import { ReviewModerationView } from '../../module2_product/components/ReviewModerationView';

// Module 3 Components
import { OrderManagementView } from '../../module3_order/components/OrderManagementView';

// Module 4 Components
import { PaymentManagementView } from '../../module4_payment/components/PaymentManagementView';
import { CourierDispatchView } from '../../module4_payment/components/CourierDispatchView';

import {
  TrendingUp,
  Users,
  UserCheck,
  ShieldAlert,
  ArrowLeft,
  LogOut,
  Shield,
  AlertTriangle,
  Package,
  Layers,
  History,
  Star,
  ShoppingBag,
  CreditCard,
  Truck,
} from 'lucide-react';

export type AdminTab =
  | 'analytics'
  | 'staff'
  | 'customers'
  | 'catalog'
  | 'inventory'
  | 'restock'
  | 'reviews'
  | 'orders'
  | 'payments'
  | 'courier'
  | 'audits';

export default function AdminDashboardPage() {
  const { user, staffProfile, isAuthenticated, isLoading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('analytics');

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-xs uppercase tracking-widest text-[#888] animate-pulse">
          Validating Security Clearance...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/account/login?redirect=/admin" replace />;
  }

  const isStaff =
    user?.role === 'STORE_STAFF' || user?.role === 'ADMIN' || user?.role === 'MANAGER';

  // Customer attempting to view admin portal
  if (!isStaff) {
    return (
      <div className="max-w-lg mx-auto py-20 px-4 text-center">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
        <h1 className="font-serif text-2xl text-[#0a0a0a] mb-2">Access Restricted</h1>
        <p className="text-xs text-zinc-500 mb-6 leading-relaxed">
          The back-office administrative portal requires operational store staff or managerial
          clearance. You are currently logged in with a standard customer account ({user?.email}).
        </p>
        <Link
          to="/account"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white text-xs uppercase tracking-wider font-medium rounded-none hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Customer Account</span>
        </Link>
      </div>
    );
  }

  const clearance = staffProfile?.clearanceLevel || (user?.role === 'ADMIN' ? 'ADMIN_SUPER' : 'TIER_1');
  const staffName =
    user?.role === 'ADMIN' || clearance === 'ADMIN_SUPER'
      ? 'CHAMINDA PERERA'
      : staffProfile
      ? `${staffProfile.firstName} ${staffProfile.lastName}`
      : user?.email.split('@')[0] || 'Staff Member';

  const designation =
    staffProfile?.designation ||
    (clearance === 'ADMIN_SUPER' ? 'Lead Systems Administrator' : user?.role);

  return (
    <div className="w-full bg-zinc-50 min-h-screen text-[#0a0a0a]">
      {/* Top Header */}
      <header className="bg-white border-b border-zinc-200 px-6 py-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-black transition-colors pr-4 border-r border-zinc-200"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Storefront</span>
            </Link>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-xl font-bold tracking-tight text-[#0a0a0a]">
                  D&apos;FINE OMS
                </span>
                <span className="text-[10px] bg-black text-white px-2 py-0.5 font-mono font-medium tracking-wider">
                  BACK-OFFICE
                </span>
              </div>
              <div className="text-[11px] text-zinc-500 font-mono">
                Executive Order Management System Portal
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right text-xs">
              <div className="font-medium text-sm text-zinc-900">{staffName}</div>
              <div className="flex items-center gap-1 text-[10px] text-zinc-500 justify-end">
                <Shield className="w-3 h-3 text-zinc-700" />
                <span className="font-semibold text-zinc-800">{clearance}</span>
                <span>&bull; {designation}</span>
              </div>
            </div>

            <button
              onClick={() => logout()}
              className="p-2 border border-zinc-300 hover:bg-zinc-100 text-zinc-700 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
          {/* Navigation Sidebar */}
          <aside className="space-y-6">
            {/* MODULE 1 */}
            <div className="space-y-1">
              <div className="flex items-center justify-between px-3 pb-1.5 border-b border-zinc-200">
                <span className="text-[10px] uppercase tracking-wider font-bold text-zinc-900">
                  Module 1: User &amp; IAM
                </span>
              </div>

              <button
                onClick={() => setActiveTab('analytics')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium transition-colors text-left cursor-pointer ${
                  activeTab === 'analytics'
                    ? 'bg-black text-white'
                    : 'text-zinc-600 hover:bg-white hover:text-black'
                }`}
              >
                <TrendingUp className="w-4 h-4 shrink-0" />
                <span>Executive Analytics</span>
              </button>

              <button
                onClick={() => setActiveTab('staff')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium transition-colors text-left cursor-pointer ${
                  activeTab === 'staff'
                    ? 'bg-black text-white'
                    : 'text-zinc-600 hover:bg-white hover:text-black'
                }`}
              >
                <Users className="w-4 h-4 shrink-0" />
                <span>Staff &amp; Role Clearance</span>
              </button>

              <button
                onClick={() => setActiveTab('customers')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium transition-colors text-left cursor-pointer ${
                  activeTab === 'customers'
                    ? 'bg-black text-white'
                    : 'text-zinc-600 hover:bg-white hover:text-black'
                }`}
              >
                <UserCheck className="w-4 h-4 shrink-0" />
                <span>Customer Registry</span>
              </button>

              <button
                onClick={() => setActiveTab('audits')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium transition-colors text-left cursor-pointer ${
                  activeTab === 'audits'
                    ? 'bg-black text-white'
                    : 'text-zinc-600 hover:bg-white hover:text-black'
                }`}
              >
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>Security Login Audits</span>
              </button>
            </div>

            {/* MODULE 2 */}
            <div className="space-y-1">
              <div className="flex items-center justify-between px-3 pb-1.5 border-b border-zinc-200">
                <span className="text-[10px] uppercase tracking-wider font-bold text-zinc-900">
                  Module 2: Catalog &amp; Stock
                </span>
              </div>

              <button
                onClick={() => setActiveTab('catalog')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium transition-colors text-left cursor-pointer ${
                  activeTab === 'catalog'
                    ? 'bg-black text-white'
                    : 'text-zinc-600 hover:bg-white hover:text-black'
                }`}
              >
                <Package className="w-4 h-4 shrink-0" />
                <span>Product Catalog CRUD</span>
              </button>

              <button
                onClick={() => setActiveTab('inventory')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium transition-colors text-left cursor-pointer ${
                  activeTab === 'inventory'
                    ? 'bg-black text-white'
                    : 'text-zinc-600 hover:bg-white hover:text-black'
                }`}
              >
                <Layers className="w-4 h-4 shrink-0" />
                <span>Variant SKU Matrix</span>
              </button>

              <button
                onClick={() => setActiveTab('restock')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium transition-colors text-left cursor-pointer ${
                  activeTab === 'restock'
                    ? 'bg-black text-white'
                    : 'text-zinc-600 hover:bg-white hover:text-black'
                }`}
              >
                <History className="w-4 h-4 shrink-0" />
                <span>Restock Intake Logs</span>
              </button>

              <button
                onClick={() => setActiveTab('reviews')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium transition-colors text-left cursor-pointer ${
                  activeTab === 'reviews'
                    ? 'bg-black text-white'
                    : 'text-zinc-600 hover:bg-white hover:text-black'
                }`}
              >
                <Star className="w-4 h-4 shrink-0" />
                <span>Review Moderation</span>
              </button>
            </div>

            {/* MODULE 3 */}
            <div className="space-y-1">
              <div className="flex items-center justify-between px-3 pb-1.5 border-b border-zinc-200">
                <span className="text-[10px] uppercase tracking-wider font-bold text-zinc-900">
                  Module 3: Orders &amp; Cart
                </span>
              </div>

              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium transition-colors text-left cursor-pointer ${
                  activeTab === 'orders'
                    ? 'bg-black text-white'
                    : 'text-zinc-600 hover:bg-white hover:text-black'
                }`}
              >
                <ShoppingBag className="w-4 h-4 shrink-0" />
                <span>Order Operations Console</span>
              </button>
            </div>

            {/* MODULE 4 */}
            <div className="space-y-1">
              <div className="flex items-center justify-between px-3 pb-1.5 border-b border-zinc-200">
                <span className="text-[10px] uppercase tracking-wider font-bold text-zinc-900">
                  Module 4: Payments &amp; Delivery
                </span>
              </div>

              <button
                onClick={() => setActiveTab('payments')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium transition-colors text-left cursor-pointer ${
                  activeTab === 'payments'
                    ? 'bg-black text-white'
                    : 'text-zinc-600 hover:bg-white hover:text-black'
                }`}
              >
                <CreditCard className="w-4 h-4 shrink-0" />
                <span>Bank Slips &amp; COD Settlement</span>
              </button>

              <button
                onClick={() => setActiveTab('courier')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium transition-colors text-left cursor-pointer ${
                  activeTab === 'courier'
                    ? 'bg-black text-white'
                    : 'text-zinc-600 hover:bg-white hover:text-black'
                }`}
              >
                <Truck className="w-4 h-4 shrink-0" />
                <span>Courier Logistics &amp; Dispatch</span>
              </button>
            </div>

            {/* Attribution Footnote */}
            <div className="p-3 bg-zinc-100 border border-zinc-200 text-[10px] text-zinc-500 space-y-1">
              <div className="font-semibold text-zinc-900 uppercase">SLIIT Assessment 2026</div>
              <div>Joint OOAD &amp; DMS System Architecture</div>
            </div>
          </aside>

          {/* Active View Container */}
          <main>
            {activeTab === 'analytics' && <AnalyticsDashboardView />}
            {activeTab === 'staff' && <StaffManagementView />}
            {activeTab === 'customers' && <CustomerDirectoryView />}
            {activeTab === 'audits' && <SecurityAuditView />}

            {activeTab === 'catalog' && <ProductCatalogView />}
            {activeTab === 'inventory' && <VariantInventoryView />}
            {activeTab === 'restock' && <RestockHistoryView />}
            {activeTab === 'reviews' && <ReviewModerationView />}

            {activeTab === 'orders' && <OrderManagementView />}

            {activeTab === 'payments' && <PaymentManagementView />}
            {activeTab === 'courier' && <CourierDispatchView />}
          </main>
        </div>
      </div>
    </div>
  );
}
