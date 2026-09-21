/**
 * Mobile Navigation Drawer
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { useDfineStore } from '../../context/store-context';
import { CloseIcon, DfineLogo, ChevronRightIcon } from '../common/icons';

export function MobileDrawer() {
  const { isMenuOpen, setIsMenuOpen } = useDfineStore();

  if (!isMenuOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
      <div
        onClick={() => setIsMenuOpen(false)}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs animate-in fade-in"
      />

      <div className="fixed inset-y-0 left-0 max-w-full flex pr-10">
        <div className="w-screen max-w-xs sm:max-w-sm bg-white text-[#2a3743] flex flex-col shadow-2xl animate-in slide-in-from-left duration-300">
          <div className="p-6 border-b border-[#e8e6e3] flex items-center justify-between">
            <DfineLogo className="text-[#2a3743]" />
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-1.5 hover:opacity-60"
              aria-label="Close menu"
            >
              <CloseIcon className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <nav className="space-y-3 text-[15px] font-medium">
              <div>
                <Link
                  to="#all-new"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-between py-2 border-b border-[#f0ede6]"
                >
                  <span>New This Week</span>
                  <ChevronRightIcon className="w-4 h-4 text-neutral-400" />
                </Link>
              </div>

              <div>
                <Link
                  to="#essentials"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-between py-2 border-b border-[#f0ede6]"
                >
                  <span>Everyday Essentials</span>
                  <ChevronRightIcon className="w-4 h-4 text-neutral-400" />
                </Link>
              </div>

              <div>
                <Link
                  to="/collections/2026-new"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-between py-2 border-b border-[#f0ede6]"
                >
                  <span>Dresses</span>
                  <ChevronRightIcon className="w-4 h-4 text-neutral-400" />
                </Link>
              </div>

              <div>
                <Link
                  to="#hero"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-between py-2 border-b border-[#f0ede6]"
                >
                  <span>The Linen Edit</span>
                  <ChevronRightIcon className="w-4 h-4 text-neutral-400" />
                </Link>
              </div>
            </nav>

            <div className="pt-6 border-t border-[#e8e6e3] space-y-2 text-[13px] text-[#526b81]">
              <p>Premium retail clothing & bespoke tailoring</p>
              <p>30-day hassle-free returns</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
