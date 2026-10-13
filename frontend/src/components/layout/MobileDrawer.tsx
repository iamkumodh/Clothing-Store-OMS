/**
 * Mobile Navigation Drawer for Streetwear Brand
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { useDfineStore } from '../../context/store-context';
import { CloseIcon, DfineLogo } from '../common/icons';

export function MobileDrawer() {
  const { isMenuOpen, setIsMenuOpen } = useDfineStore();

  if (!isMenuOpen) return null;

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
      <div
        onClick={closeMenu}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs animate-in fade-in"
      />

      <div className="fixed inset-y-0 left-0 max-w-full flex pr-10">
        <div className="w-screen max-w-xs sm:max-w-sm bg-white text-[#0a0a0a] flex flex-col shadow-2xl animate-in slide-in-from-left duration-300">
          <div className="p-6 border-b border-zinc-200 flex items-center justify-between">
            <DfineLogo className="text-black" />
            <button
              onClick={closeMenu}
              className="p-1.5 hover:opacity-60 cursor-pointer"
              aria-label="Close menu"
            >
              <CloseIcon className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <nav className="space-y-1 text-[15px] font-medium">
              {/* Spandex */}
              <div>
                <Link
                  to="/collections/spandex"
                  onClick={closeMenu}
                  className="flex items-center justify-between py-3 border-b border-zinc-100 hover:text-neutral-600 transition-colors"
                >
                  <div className="flex flex-col">
                    <span className="font-semibold text-neutral-900">Spandex Series</span>
                    <span className="text-[11px] text-neutral-500 font-normal">Stretch & Precision Drape (240–260 GSM)</span>
                  </div>
                  <span className="text-xs text-neutral-400">→</span>
                </Link>
              </div>

              {/* French Terry */}
              <div>
                <Link
                  to="/collections/terry"
                  onClick={closeMenu}
                  className="flex items-center justify-between py-3 border-b border-zinc-100 hover:text-neutral-600 transition-colors"
                >
                  <div className="flex flex-col">
                    <span className="font-semibold text-neutral-900">French Terry</span>
                    <span className="text-[11px] text-neutral-500 font-normal">Micro-Loop Knitted Streetwear (260 GSM)</span>
                  </div>
                  <span className="text-xs text-neutral-400">→</span>
                </Link>
              </div>

              {/* Garment Dye */}
              <div>
                <Link
                  to="/collections/dye"
                  onClick={closeMenu}
                  className="flex items-center justify-between py-3 border-b border-zinc-100 hover:text-neutral-600 transition-colors"
                >
                  <div className="flex flex-col">
                    <span className="font-semibold text-neutral-900">Garment Dye</span>
                    <span className="text-[11px] text-neutral-500 font-normal">Authentic Vintage Patina (240 GSM)</span>
                  </div>
                  <span className="text-xs text-neutral-400">→</span>
                </Link>
              </div>

              {/* All T-Shirts */}
              <div>
                <Link
                  to="/collections/all"
                  onClick={closeMenu}
                  className="flex items-center justify-between py-3 border-b border-zinc-100 hover:text-neutral-600 transition-colors"
                >
                  <span className="font-semibold text-neutral-900">All T-Shirts</span>
                  <span className="text-xs text-neutral-400">→</span>
                </Link>
              </div>
            </nav>

            <div className="pt-6 border-t border-zinc-200 space-y-2 text-[13px] text-zinc-500">
              <p>Premium 240–260 GSM streetwear apparel</p>
              <p>Islandwide Sri Lanka delivery (LKR)</p>
              <p>7-day hassle-free fit exchange</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
