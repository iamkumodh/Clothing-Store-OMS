/**
 * D'fine Clothing Store - Main Application Shell
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DfineStoreProvider } from './context/store-context';
import { SiteHeader } from './components/layout/SiteHeader';
import { SiteFooter } from './components/layout/SiteFooter';
import { MobileDrawer } from './components/layout/MobileDrawer';

function StorefrontPlaceholder() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-24 bg-[#faf9f8]">
      <div className="max-w-xl mx-auto space-y-4">
        <h1 className="text-3xl sm:text-5xl font-serif text-[#2a3743] tracking-tight">
          Something amazing coming soon!
        </h1>
        <p className="text-sm sm:text-base text-[#526b81] font-light tracking-wide uppercase">
          D'fine Clothing Store
        </p>
      </div>
    </div>
  );
}

function AppShell() {
  return (
    <div className="relative min-h-screen flex flex-col bg-white text-[#2a3743] antialiased selection:bg-[#2a3743] selection:text-white">
      <SiteHeader variant="solid" />
      <MobileDrawer />

      <main id="main-content" role="main" className="flex-1 w-full">
        <Routes>
          <Route path="/" element={<StorefrontPlaceholder />} />
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
