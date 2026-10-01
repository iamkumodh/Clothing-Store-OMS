/**
 * Site Header - Navigation, Logo & Quick Actions for T-Shirt Brand
 */
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  DfineLogo,
  MenuIcon,
  SearchIcon,
  BagIcon,
  AccountIcon,
  ChevronDownIcon,
} from '../common/icons';
import { useDfineStore } from '../../context/store-context';
import { useAuth } from '../../modules/module1_user/context/AuthContext';

export function SiteHeader({ variant = 'overlay' }: { variant?: 'overlay' | 'solid' }) {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const { totalItems, setIsCartOpen, setIsMenuOpen, setIsSearchOpen } = useDfineStore();
  const { user, isAuthenticated } = useAuth();
  const isStaff = user?.role === 'STORE_STAFF' || user?.role === 'ADMIN' || user?.role === 'MANAGER';
  const [activeMegamenu, setActiveMegamenu] = useState<'men' | 'women' | 'unisex' | null>(null);
  const [isStuck, setIsStuck] = useState(false);

  const prevScrollRef = useRef(0);

  useEffect(() => {
    if (variant === 'solid') return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentY = window.scrollY;

          // Hysteresis threshold for smooth transition
          if (currentY > 110) {
            setIsStuck(true);
            setActiveMegamenu(null);
          } else if (currentY < 60) {
            setIsStuck(false);
          }

          prevScrollRef.current = currentY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [variant]);

  return (
    <>
      <div
        className={`w-full z-40 transition-[background-color,color,box-shadow] duration-300 ease-[cubic-bezier(0.165,0.84,0.44,1)] ${
          variant === 'solid'
            ? 'sticky top-0 bg-white text-[#0a0a0a] border-b border-zinc-200 shadow-xs'
            : isStuck
              ? 'fixed top-0 left-0 right-0 bg-white text-[#0a0a0a] shadow-[0_1px_3px_rgba(0,0,0,0.08)] border-b border-zinc-200'
              : 'absolute top-0 left-0 right-0 bg-gradient-to-b from-black/40 via-black/20 to-transparent text-white'
        }`}
        onMouseLeave={() => setActiveMegamenu(null)}
      >
        {/* Main Navigation Bar */}
        <header className="relative w-full">
          <div
            className={`max-w-[1600px] mx-auto px-8 grid grid-cols-[1fr_auto_1fr] items-center transition-[height] duration-300 ${
              isHome && !isStuck ? 'h-[76px] sm:h-[84px]' : 'h-[64px]'
            }`}
          >
            {/* Left Zone: Hamburger/Search + Navigation */}
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsMenuOpen(true)}
                  className="lg:hidden p-1.5 hover:opacity-75 focus:outline-none"
                  aria-label="Open menu"
                >
                  <MenuIcon className="w-5 h-5" />
                </button>

                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-1 hover:opacity-75 transition-opacity focus:outline-none"
                  aria-label="Search"
                >
                  <SearchIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Left Navigation: Men, Women, Unisex, GSM Guide, Sale */}
              <nav className="hidden lg:flex items-center gap-6 text-[13px] font-medium tracking-wide">
                {/* Men's Megamenu */}
                <div
                  className="relative py-5 cursor-pointer flex items-center gap-1 group"
                  onMouseEnter={() => setActiveMegamenu('men')}
                >
                  <Link
                    to="/collections/men"
                    className="hover:opacity-80 transition-opacity relative after:absolute after:bottom-[-2px] after:left-0 after:w-full after:h-[1.5px] after:bg-current after:scale-x-0 group-hover:after:scale-x-100 after:transition-transform"
                  >
                    Men
                  </Link>
                  <ChevronDownIcon className="w-2.5 h-2.5 opacity-70 group-hover:rotate-180 transition-transform" />
                </div>

                {/* Women's Megamenu */}
                <div
                  className="relative py-5 cursor-pointer flex items-center gap-1 group"
                  onMouseEnter={() => setActiveMegamenu('women')}
                >
                  <Link
                    to="/collections/women"
                    className="hover:opacity-80 transition-opacity relative after:absolute after:bottom-[-2px] after:left-0 after:w-full after:h-[1.5px] after:bg-current after:scale-x-0 group-hover:after:scale-x-100 after:transition-transform"
                  >
                    Women
                  </Link>
                  <ChevronDownIcon className="w-2.5 h-2.5 opacity-70 group-hover:rotate-180 transition-transform" />
                </div>

                {/* Unisex Megamenu */}
                <div
                  className="relative py-5 cursor-pointer flex items-center gap-1 group"
                  onMouseEnter={() => setActiveMegamenu('unisex')}
                >
                  <Link
                    to="/collections/unisex"
                    className="hover:opacity-80 transition-opacity relative after:absolute after:bottom-[-2px] after:left-0 after:w-full after:h-[1.5px] after:bg-current after:scale-x-0 group-hover:after:scale-x-100 after:transition-transform"
                  >
                    Unisex & Streetwear
                  </Link>
                  <ChevronDownIcon className="w-2.5 h-2.5 opacity-70 group-hover:rotate-180 transition-transform" />
                </div>

                {/* GSM Guide Anchor */}
                <a
                  href="/#gsm-guide"
                  className="hover:opacity-80 transition-opacity relative after:absolute after:bottom-[-2px] after:left-0 after:w-full after:h-[1.5px] after:bg-current after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
                >
                  GSM & Fit Guide
                </a>

                {/* Sale Link */}
                <Link
                  to="/collections/sale"
                  className="hover:opacity-80 transition-opacity text-rose-400 hover:text-rose-500 relative after:absolute after:bottom-[-2px] after:left-0 after:w-full after:h-[1.5px] after:bg-current after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
                >
                  Sale
                </Link>
              </nav>
            </div>

            {/* Center Zone: Brand Logo */}
            <div className="px-8 flex justify-center">
              <Link to="/" className="flex items-center justify-center">
                <DfineLogo
                  className={
                    isHome
                      ? isStuck
                        ? 'h-[34px] w-[135px]'
                        : 'h-[45px] w-[175px]'
                      : 'h-[28px] w-[115px]'
                  }
                  inverted={variant !== 'solid' && !isStuck}
                />
              </Link>
            </div>

            {/* Right Zone: All Tees + Account & Bag */}
            <div className="flex items-center justify-end gap-8">
              <nav className="hidden lg:flex items-center gap-7 text-[13px] font-medium tracking-wide">
                <Link
                  to="/collections/all"
                  className="hover:opacity-80 transition-opacity relative after:absolute after:bottom-[-2px] after:left-0 after:w-full after:h-[1.5px] after:bg-current after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
                >
                  All T-Shirts
                </Link>
              </nav>

              <div className="flex items-center gap-3 sm:gap-4">
                {isStaff && (
                  <Link
                    to="/admin"
                    className={`hidden md:inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded border transition-colors ${
                      isStuck || variant === 'solid'
                        ? 'border-black text-black hover:bg-black hover:text-white'
                        : 'border-white text-white hover:bg-white hover:text-black'
                    }`}
                  >
                    Admin Portal
                  </Link>
                )}

                <Link
                  to={isAuthenticated ? (isStaff ? '/admin' : '/account') : '/account/login'}
                  className="hidden sm:block p-1 hover:opacity-75 transition-opacity focus:outline-none relative"
                  aria-label={isAuthenticated ? 'My Account' : 'Sign In'}
                  title={isAuthenticated ? (isStaff ? 'Admin Portal' : 'My Account') : 'Sign In'}
                >
                  <AccountIcon className="w-5 h-5" />
                  {isAuthenticated && (
                    <span
                      className={`absolute bottom-0 right-0 w-2 h-2 rounded-full ring-1 ring-white ${
                        isStaff ? 'bg-rose-500' : 'bg-emerald-500'
                      }`}
                    />
                  )}
                </Link>

                <button
                  onClick={() => setIsCartOpen(true)}
                  className="relative p-1 hover:opacity-75 transition-opacity focus:outline-none cursor-pointer"
                  aria-label="Shopping Cart"
                >
                  <BagIcon className="w-5 h-5" />
                  {totalItems > 0 && (
                    <span
                      className={`absolute -top-1 -right-1 text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center transition-colors ${
                        isStuck || variant === 'solid'
                          ? 'bg-black text-white'
                          : 'bg-white text-black'
                      }`}
                    >
                      {totalItems}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Megamenu: Men */}
          {activeMegamenu === 'men' && (
            <div
              className="absolute top-full left-0 w-full bg-white text-[#0a0a0a] border-b border-zinc-200 shadow-2xl py-8 px-8 z-50 animate-in fade-in slide-in-from-top-1 duration-200"
              onMouseEnter={() => setActiveMegamenu('men')}
              onMouseLeave={() => setActiveMegamenu(null)}
            >
              <div className="max-w-[1400px] mx-auto grid grid-cols-4 gap-8 text-[13px]">
                {/* Column 1: By Fit */}
                <div>
                  <h3 className="font-semibold text-[12px] tracking-wider uppercase text-neutral-900 mb-3 pb-1 border-b border-neutral-100">
                    By Fit / Cut
                  </h3>
                  <ul className="space-y-2.5 text-neutral-600">
                    <li>
                      <Link to="/collections/men?fit=Oversized" className="hover:text-black hover:underline transition-all">
                        Oversized & Drop-Shoulder
                      </Link>
                    </li>
                    <li>
                      <Link to="/collections/men?fit=Relaxed" className="hover:text-black hover:underline transition-all">
                        Relaxed Everyday Fit
                      </Link>
                    </li>
                    <li>
                      <Link to="/collections/men?fit=Classic" className="hover:text-black hover:underline transition-all">
                        Classic Regular Crew
                      </Link>
                    </li>
                    <li>
                      <Link to="/collections/men" className="hover:text-black hover:underline transition-all">
                        View All Men's Fits
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Column 2: By Style & Weight */}
                <div>
                  <h3 className="font-semibold text-[12px] tracking-wider uppercase text-neutral-900 mb-3 pb-1 border-b border-neutral-100">
                    By Style & Fabric
                  </h3>
                  <ul className="space-y-2.5 text-neutral-600">
                    <li>
                      <Link to="/collections/men?gsm=260" className="hover:text-black hover:underline transition-all">
                        Heavyweight Blanks (260 GSM)
                      </Link>
                    </li>
                    <li>
                      <Link to="/collections/men?category=Vintage+Washed" className="hover:text-black hover:underline transition-all">
                        Vintage Pigment-Dyed
                      </Link>
                    </li>
                    <li>
                      <Link to="/collections/men?gsm=180" className="hover:text-black hover:underline transition-all">
                        Everyday Pima Cotton (180 GSM)
                      </Link>
                    </li>
                    <li>
                      <Link to="/collections/men" className="hover:text-black hover:underline transition-all">
                        Stripe & Texture Series
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Column 3: Curated Edits */}
                <div>
                  <h3 className="font-semibold text-[12px] tracking-wider uppercase text-neutral-900 mb-3 pb-1 border-b border-neutral-100">
                    Curated Drops
                  </h3>
                  <ul className="space-y-2.5 text-neutral-600">
                    <li>
                      <Link to="/collections/men" className="hover:text-black hover:underline transition-all">
                        New Men's Drops
                      </Link>
                    </li>
                    <li>
                      <Link to="/collections/men" className="hover:text-black hover:underline transition-all">
                        Bestseller Monochrome Capsule
                      </Link>
                    </li>
                    <li>
                      <a href="/#gsm-guide" className="hover:text-black hover:underline transition-all">
                        Men's Fit & GSM Guide
                      </a>
                    </li>
                  </ul>
                </div>

                {/* Column 4: Feature Card */}
                <div className="flex flex-col group/card cursor-pointer">
                  <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2px] bg-neutral-100 mb-3">
                    <img
                      src="/images/coll-the-base-crew.png"
                      alt="Minimalist Signature Heavy Tee"
                      className="w-full h-full object-cover transition-opacity duration-300 group-hover/card:opacity-90"
                      loading="lazy"
                    />
                    <div className="absolute top-2 left-2 bg-black text-white text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-xs">
                      260 GSM Heavy
                    </div>
                  </div>
                  <h4 className="font-semibold text-[13px] text-neutral-900">Minimalist Heavy Tee</h4>
                  <p className="text-[12px] text-neutral-500 mt-0.5 leading-snug">
                    Architectural boxy cut in pure organic combed cotton
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Megamenu: Women */}
          {activeMegamenu === 'women' && (
            <div
              className="absolute top-full left-0 w-full bg-white text-[#0a0a0a] border-b border-zinc-200 shadow-2xl py-8 px-8 z-50 animate-in fade-in slide-in-from-top-1 duration-200"
              onMouseEnter={() => setActiveMegamenu('women')}
              onMouseLeave={() => setActiveMegamenu(null)}
            >
              <div className="max-w-[1400px] mx-auto grid grid-cols-4 gap-8 text-[13px]">
                {/* Column 1: By Fit */}
                <div>
                  <h3 className="font-semibold text-[12px] tracking-wider uppercase text-neutral-900 mb-3 pb-1 border-b border-neutral-100">
                    By Fit / Silhouette
                  </h3>
                  <ul className="space-y-2.5 text-neutral-600">
                    <li>
                      <Link to="/collections/women?fit=Boxy+Cropped" className="hover:text-black hover:underline transition-all">
                        Boxy Cropped Street Tee
                      </Link>
                    </li>
                    <li>
                      <Link to="/collections/women?fit=Classic" className="hover:text-black hover:underline transition-all">
                        Relaxed Everyday Baby Tee
                      </Link>
                    </li>
                    <li>
                      <Link to="/collections/women?fit=Relaxed" className="hover:text-black hover:underline transition-all">
                        Washed Boyfriend Drop
                      </Link>
                    </li>
                    <li>
                      <Link to="/collections/women" className="hover:text-black hover:underline transition-all">
                        View All Women's Fits
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Column 2: By Style & Fabric */}
                <div>
                  <h3 className="font-semibold text-[12px] tracking-wider uppercase text-neutral-900 mb-3 pb-1 border-b border-neutral-100">
                    By Style & Fabric
                  </h3>
                  <ul className="space-y-2.5 text-neutral-600">
                    <li>
                      <Link to="/collections/women?gsm=240" className="hover:text-black hover:underline transition-all">
                        Dense 240 GSM Jersey
                      </Link>
                    </li>
                    <li>
                      <Link to="/collections/women?gsm=180" className="hover:text-black hover:underline transition-all">
                        Soft Ribbed Combed Cotton
                      </Link>
                    </li>
                    <li>
                      <Link to="/collections/women?category=Graphic+Tees" className="hover:text-black hover:underline transition-all">
                        Minimalist Typography & Prints
                      </Link>
                    </li>
                    <li>
                      <Link to="/collections/women?category=Vintage+Washed" className="hover:text-black hover:underline transition-all">
                        Vintage Garment Washed
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Column 3: Curated Edits */}
                <div>
                  <h3 className="font-semibold text-[12px] tracking-wider uppercase text-neutral-900 mb-3 pb-1 border-b border-neutral-100">
                    Curated Drops
                  </h3>
                  <ul className="space-y-2.5 text-neutral-600">
                    <li>
                      <Link to="/collections/women" className="hover:text-black hover:underline transition-all">
                        New This Week
                      </Link>
                    </li>
                    <li>
                      <Link to="/collections/women" className="hover:text-black hover:underline transition-all">
                        The Cropped Essentials Edit
                      </Link>
                    </li>
                    <li>
                      <a href="/#gsm-guide" className="hover:text-black hover:underline transition-all">
                        Women's Fit & Fabric Guide
                      </a>
                    </li>
                  </ul>
                </div>

                {/* Column 4: Feature Card */}
                <div className="flex flex-col group/card cursor-pointer">
                  <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2px] bg-neutral-100 mb-3">
                    <img
                      src="/images/coll-the-ines-tee.png"
                      alt="Boxy Cropped Street Tee"
                      className="w-full h-full object-cover transition-opacity duration-300 group-hover/card:opacity-90"
                      loading="lazy"
                    />
                    <div className="absolute top-2 left-2 bg-black text-white text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-xs">
                      240 GSM Dense
                    </div>
                  </div>
                  <h4 className="font-semibold text-[13px] text-neutral-900">Boxy Cropped Street Tee</h4>
                  <p className="text-[12px] text-neutral-500 mt-0.5 leading-snug">
                    Structured wide crop with seamless collar binding
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Megamenu: Unisex */}
          {activeMegamenu === 'unisex' && (
            <div
              className="absolute top-full left-0 w-full bg-white text-[#0a0a0a] border-b border-zinc-200 shadow-2xl py-8 px-8 z-50 animate-in fade-in slide-in-from-top-1 duration-200"
              onMouseEnter={() => setActiveMegamenu('unisex')}
              onMouseLeave={() => setActiveMegamenu(null)}
            >
              <div className="max-w-[1400px] mx-auto grid grid-cols-4 gap-8 text-[13px]">
                {/* Column 1: Fit & Cut */}
                <div>
                  <h3 className="font-semibold text-[12px] tracking-wider uppercase text-neutral-900 mb-3 pb-1 border-b border-neutral-100">
                    Silhouette & Cut
                  </h3>
                  <ul className="space-y-2.5 text-neutral-600">
                    <li>
                      <Link to="/collections/unisex?fit=Oversized" className="hover:text-black hover:underline transition-all">
                        Heavyweight Drop-Shoulder
                      </Link>
                    </li>
                    <li>
                      <Link to="/collections/unisex?fit=Oversized" className="hover:text-black hover:underline transition-all">
                        Architectural Boxy Cut
                      </Link>
                    </li>
                    <li>
                      <Link to="/collections/unisex?fit=Relaxed" className="hover:text-black hover:underline transition-all">
                        Relaxed Street Fit
                      </Link>
                    </li>
                    <li>
                      <Link to="/collections/unisex" className="hover:text-black hover:underline transition-all">
                        View All Streetwear Cuts
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Column 2: Styles & Drops */}
                <div>
                  <h3 className="font-semibold text-[12px] tracking-wider uppercase text-neutral-900 mb-3 pb-1 border-b border-neutral-100">
                    Drops & Graphics
                  </h3>
                  <ul className="space-y-2.5 text-neutral-600">
                    <li>
                      <Link to="/collections/unisex?category=Graphic+Tees" className="hover:text-black hover:underline transition-all">
                        Tokyo Drift Graphic Series
                      </Link>
                    </li>
                    <li>
                      <Link to="/collections/unisex?category=Vintage+Washed" className="hover:text-black hover:underline transition-all">
                        Acid-Wash Cyberpunk Series
                      </Link>
                    </li>
                    <li>
                      <Link to="/collections/unisex?gsm=260" className="hover:text-black hover:underline transition-all">
                        Pure Heavyweight Blanks (260 GSM)
                      </Link>
                    </li>
                    <li>
                      <Link to="/collections/unisex" className="hover:text-black hover:underline transition-all">
                        Custom DTG Canvas Series
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Column 3: Curated Edits */}
                <div>
                  <h3 className="font-semibold text-[12px] tracking-wider uppercase text-neutral-900 mb-3 pb-1 border-b border-neutral-100">
                    Curated Drops
                  </h3>
                  <ul className="space-y-2.5 text-neutral-600">
                    <li>
                      <Link to="/collections/unisex" className="hover:text-black hover:underline transition-all">
                        Streetwear Bestsellers
                      </Link>
                    </li>
                    <li>
                      <Link to="/collections/unisex" className="hover:text-black hover:underline transition-all">
                        Limited Batch Prints
                      </Link>
                    </li>
                    <li>
                      <a href="/#gsm-guide" className="hover:text-black hover:underline transition-all">
                        Textile Weight & GSM Breakdown
                      </a>
                    </li>
                  </ul>
                </div>

                {/* Column 4: Feature Card */}
                <div className="flex flex-col group/card cursor-pointer">
                  <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2px] bg-neutral-100 mb-3">
                    <img
                      src="/images/coll-the-nico-tee.png"
                      alt="Tokyo Drift Oversized Tee"
                      className="w-full h-full object-cover transition-opacity duration-300 group-hover/card:opacity-90"
                      loading="lazy"
                    />
                    <div className="absolute top-2 left-2 bg-black text-white text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-xs">
                      240 GSM Graphic
                    </div>
                  </div>
                  <h4 className="font-semibold text-[13px] text-neutral-900">Tokyo Drift Oversized Tee</h4>
                  <p className="text-[12px] text-neutral-500 mt-0.5 leading-snug">
                    High-density screenprint on pre-shrunk combed cotton
                  </p>
                </div>
              </div>
            </div>
          )}
        </header>
      </div>
    </>
  );
}
