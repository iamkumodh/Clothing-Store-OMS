/**
 * D'fine Clothing Store - Main Application Shell
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { DfineStoreProvider } from './context/store-context';
import { SiteHeader } from './components/layout/SiteHeader';
import { SiteFooter } from './components/layout/SiteFooter';
import { MobileDrawer } from './components/layout/MobileDrawer';
import { CartDrawer } from './components/modals/CartDrawer';
import { QuickViewModal } from './components/modals/QuickViewModal';
import { SearchModal } from './components/modals/SearchModal';

// Pages (Lazy Loaded for Route-Level Code Splitting)
const HomePage = React.lazy(() => import('./pages/HomePage'));
const CollectionPage = React.lazy(() => import('./pages/CollectionPage'));
const ProductDetailPage = React.lazy(() => import('./pages/ProductDetailPage'));
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const CheckoutPage = React.lazy(() => import('./pages/CheckoutPage'));
const OrderSuccessPage = React.lazy(() => import('./pages/OrderSuccessPage'));
const SearchPage = React.lazy(() => import('./pages/SearchPage'));

// Module 1 Pages & Providers
import { AuthProvider } from './modules/module1_user/context/AuthContext';
const AccountPage = React.lazy(() => import('./modules/module1_user/pages/AccountPage'));
const AdminDashboardPage = React.lazy(() => import('./modules/module1_user/pages/AdminDashboardPage'));
const InvoicePrintPage = React.lazy(() => import('./modules/module1_user/pages/InvoicePrintPage'));

function PageFallback() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function AppShell() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="relative min-h-screen flex flex-col bg-white text-[#0a0a0a] antialiased selection:bg-black selection:text-white">
      <SiteHeader variant={isHome ? 'overlay' : 'solid'} />

      <MobileDrawer />
      <SearchModal />
      <CartDrawer />
      <QuickViewModal />

      <main id="main-content" role="main" className="flex-1 w-full">
        <React.Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/collections/:handle" element={<CollectionPage />} />
            <Route path="/products/:handle" element={<ProductDetailPage />} />
            <Route
              path="/collections/:collectionHandle/products/:handle"
              element={<ProductDetailPage />}
            />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-success/:orderId" element={<OrderSuccessPage />} />
            <Route path="/account/login" element={<LoginPage />} />
            <Route path="/account/register" element={<LoginPage initialMode="register" />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/invoices/:invoiceNumber" element={<InvoicePrintPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </React.Suspense>
      </main>

      <SiteFooter />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <AuthProvider>
        <DfineStoreProvider>
          <AppShell />
        </DfineStoreProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
