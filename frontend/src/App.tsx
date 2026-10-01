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

// Pages
import HomePage from './pages/HomePage';
import CollectionPage from './pages/CollectionPage';
import ProductDetailPage from './pages/ProductDetailPage';
import SearchPage from './pages/SearchPage';

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
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/collections/:handle" element={<CollectionPage />} />
          <Route path="/products/:handle" element={<ProductDetailPage />} />
          <Route
            path="/collections/:collectionHandle/products/:handle"
            element={<ProductDetailPage />}
          />
          <Route path="/search" element={<SearchPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <SiteFooter />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <DfineStoreProvider>
        <AppShell />
      </DfineStoreProvider>
    </BrowserRouter>
  );
}
