/**
 * Mobile Navigation Drawer for T-Shirt Brand
 */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDfineStore } from '../../context/store-context';
import { CloseIcon, DfineLogo, ChevronDownIcon } from '../common/icons';

export function MobileDrawer() {
  const { isMenuOpen, setIsMenuOpen } = useDfineStore();
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  if (!isMenuOpen) return null;

  const toggleSection = (section: string) => {
    setExpandedSection(prev => (prev === section ? null : section));
  };

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
            <nav className="space-y-2 text-[15px] font-medium">
              {/* Men's Accordion */}
              <div className="border-b border-zinc-100 pb-2">
                <div className="flex items-center justify-between py-2">
                  <Link
                    to="/collections/men"
                    onClick={closeMenu}
                    className="hover:text-neutral-600 transition-colors"
                  >
                    Men's T-Shirts
                  </Link>
                  <button
                    onClick={() => toggleSection('men')}
                    className="p-1 hover:opacity-75 focus:outline-none"
                    aria-label="Toggle Men's section"
                  >
                    <ChevronDownIcon
                      className={`w-4 h-4 text-zinc-500 transition-transform ${
                        expandedSection === 'men' ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                </div>
                {expandedSection === 'men' && (
                  <div className="pl-3 py-2 space-y-2 text-[13px] text-neutral-600 animate-in fade-in">
                    <div>
                      <Link to="/collections/men?fit=Oversized" onClick={closeMenu} className="hover:text-black">
                        Oversized & Drop-Shoulder
                      </Link>
                    </div>
                    <div>
                      <Link to="/collections/men?gsm=260" onClick={closeMenu} className="hover:text-black">
                        Heavyweight Blanks (260 GSM)
                      </Link>
                    </div>
                    <div>
                      <Link to="/collections/men?fit=Relaxed" onClick={closeMenu} className="hover:text-black">
                        Vintage Pigment-Dyed
                      </Link>
                    </div>
                    <div>
                      <Link to="/collections/men?gsm=180" onClick={closeMenu} className="hover:text-black">
                        Everyday Pima Crew
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Women's Accordion */}
              <div className="border-b border-zinc-100 pb-2">
                <div className="flex items-center justify-between py-2">
                  <Link
                    to="/collections/women"
                    onClick={closeMenu}
                    className="hover:text-neutral-600 transition-colors"
                  >
                    Women's T-Shirts
                  </Link>
                  <button
                    onClick={() => toggleSection('women')}
                    className="p-1 hover:opacity-75 focus:outline-none"
                    aria-label="Toggle Women's section"
                  >
                    <ChevronDownIcon
                      className={`w-4 h-4 text-zinc-500 transition-transform ${
                        expandedSection === 'women' ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                </div>
                {expandedSection === 'women' && (
                  <div className="pl-3 py-2 space-y-2 text-[13px] text-neutral-600 animate-in fade-in">
                    <div>
                      <Link to="/collections/women?fit=Boxy+Cropped" onClick={closeMenu} className="hover:text-black">
                        Boxy Cropped Street Tee
                      </Link>
                    </div>
                    <div>
                      <Link to="/collections/women?fit=Classic" onClick={closeMenu} className="hover:text-black">
                        Relaxed Everyday Baby Tee
                      </Link>
                    </div>
                    <div>
                      <Link to="/collections/women?fit=Relaxed" onClick={closeMenu} className="hover:text-black">
                        Washed Boyfriend Drop
                      </Link>
                    </div>
                    <div>
                      <Link to="/collections/women?gsm=240" onClick={closeMenu} className="hover:text-black">
                        Dense 240 GSM Jersey
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Unisex Accordion */}
              <div className="border-b border-zinc-100 pb-2">
                <div className="flex items-center justify-between py-2">
                  <Link
                    to="/collections/unisex"
                    onClick={closeMenu}
                    className="hover:text-neutral-600 transition-colors"
                  >
                    Unisex & Streetwear
                  </Link>
                  <button
                    onClick={() => toggleSection('unisex')}
                    className="p-1 hover:opacity-75 focus:outline-none"
                    aria-label="Toggle Unisex section"
                  >
                    <ChevronDownIcon
                      className={`w-4 h-4 text-zinc-500 transition-transform ${
                        expandedSection === 'unisex' ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                </div>
                {expandedSection === 'unisex' && (
                  <div className="pl-3 py-2 space-y-2 text-[13px] text-neutral-600 animate-in fade-in">
                    <div>
                      <Link to="/collections/unisex?category=Graphic+Tees" onClick={closeMenu} className="hover:text-black">
                        Tokyo Drift Graphic Series
                      </Link>
                    </div>
                    <div>
                      <Link to="/collections/unisex?gsm=260" onClick={closeMenu} className="hover:text-black">
                        Pure Heavyweight Blanks (260 GSM)
                      </Link>
                    </div>
                    <div>
                      <Link to="/collections/unisex?category=Vintage+Washed" onClick={closeMenu} className="hover:text-black">
                        Acid-Wash Cyberpunk Series
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* GSM Guide Link */}
              <div>
                <a
                  href="/#gsm-guide"
                  onClick={closeMenu}
                  className="flex items-center justify-between py-2 border-b border-zinc-100 hover:text-neutral-600 transition-colors"
                >
                  <span>GSM & Fit Guide</span>
                </a>
              </div>

              {/* All T-Shirts */}
              <div>
                <Link
                  to="/collections/all"
                  onClick={closeMenu}
                  className="flex items-center justify-between py-2 border-b border-zinc-100 hover:text-neutral-600 transition-colors"
                >
                  <span>All T-Shirts</span>
                </Link>
              </div>

              {/* Sale */}
              <div>
                <Link
                  to="/collections/sale"
                  onClick={closeMenu}
                  className="flex items-center justify-between py-2 border-b border-zinc-100 text-rose-600 hover:text-rose-700 transition-colors"
                >
                  <span>Sale Clearance</span>
                </Link>
              </div>
            </nav>

            <div className="pt-6 border-t border-zinc-200 space-y-2 text-[13px] text-zinc-500">
              <p>Premium 180–260 GSM combed cotton t-shirts</p>
              <p>Islandwide Sri Lanka delivery (LKR)</p>
              <p>7-day hassle-free fit exchange</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
