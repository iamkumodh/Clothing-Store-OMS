/**
 * Site Header - Navigation, Logo & Quick Actions
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

export function SiteHeader({ variant = 'overlay' }: { variant?: 'overlay' | 'solid' }) {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const { totalItems, setIsCartOpen, setIsMenuOpen, setIsSearchOpen } = useDfineStore();
  const [activeMegamenu, setActiveMegamenu] = useState<string | null>(null);
  const [isStuck, setIsStuck] = useState(false);

  const prevScrollRef = useRef(0);

  useEffect(() => {
    if (variant === 'solid') return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentY = window.scrollY;

          // Hysteresis threshold for ultra-clean, jitter-free transition
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
      {/* 
        Official D'fine Header Structure:
        1. When at top (isStuck = false):
           - Positioned absolute over hero banner (top: 37px)
           - Subtle linear top vignette gradient for crystal-clear readability
           - Toolbar visible with border-b border-white/20
           - Text & icons: pure white
           - White inverted logo
        2. When scrolled (isStuck = true):
           - Positioned fixed top: 0
           - Translates down by 37px (docking cleanly under sticky announcement bar)
           - Easing: cubic-bezier(0.165, 0.84, 0.44, 1) (0.4s)
           - Background: pure white with subtle shadow
           - Text & icons: dark charcoal #2a3743
           - Dark logo
           - Toolbar hidden
      */}
      <div
        className={`w-full z-40 transition-[background-color,color,box-shadow] duration-300 ease-[cubic-bezier(0.165,0.84,0.44,1)] ${
          variant === 'solid'
            ? 'sticky top-0 bg-white text-[#2a3743] border-b border-[#e5e5e5] shadow-xs'
            : isStuck
              ? 'fixed top-0 left-0 right-0 bg-white text-[#2a3743] shadow-[0_1px_3px_rgba(0,0,0,0.08)]'
              : 'absolute top-0 left-0 right-0 bg-gradient-to-b from-black/35 via-black/15 to-transparent text-white'
        }`}
        onMouseLeave={() => setActiveMegamenu(null)}
      >
        {/* Main Navigation Bar (Clean center-split layout) */}
        <header className="relative w-full">
          <div
            className={`max-w-[1600px] mx-auto px-8 grid grid-cols-[1fr_auto_1fr] items-center transition-[height] duration-300 ${
              isHome && !isStuck ? 'h-[76px] sm:h-[84px]' : 'h-[64px]'
            }`}
          >
            {/* Left Zone: Search / Hamburger + Left Nav */}
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

              {/* Left Navigation: New, Clothing, Sale */}
              <nav className="hidden lg:flex items-center gap-7 text-[13px] font-medium tracking-wide">
                {/* New Megamenu */}
                <div
                  className="relative py-5 cursor-pointer flex items-center gap-1.5 group"
                  onMouseEnter={() => setActiveMegamenu('new')}
                >
                  <Link
                    to="/collections/2026-new"
                    className="hover:opacity-80 transition-opacity relative after:absolute after:bottom-[-2px] after:left-0 after:w-full after:h-[1.5px] after:bg-current after:scale-x-0 group-hover:after:scale-x-100 after:transition-transform"
                  >
                    New
                  </Link>
                  <ChevronDownIcon className="w-2.5 h-2.5 opacity-70 group-hover:rotate-180 transition-transform" />
                </div>

                {/* Clothing Megamenu */}
                <div
                  className="relative py-5 cursor-pointer flex items-center gap-1.5 group"
                  onMouseEnter={() => setActiveMegamenu('clothing')}
                >
                  <Link
                    to="#categories"
                    className="hover:opacity-80 transition-opacity relative after:absolute after:bottom-[-2px] after:left-0 after:w-full after:h-[1.5px] after:bg-current after:scale-x-0 group-hover:after:scale-x-100 after:transition-transform"
                  >
                    Clothing
                  </Link>
                  <ChevronDownIcon className="w-2.5 h-2.5 opacity-70 group-hover:rotate-180 transition-transform" />
                </div>

                {/* Sale Link */}
                <Link
                  to="#essentials"
                  className="hover:opacity-80 transition-opacity relative after:absolute after:bottom-[-2px] after:left-0 after:w-full after:h-[1.5px] after:bg-current after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
                >
                  Sale
                </Link>
              </nav>
            </div>

            {/* Center Zone: Brand Logo with buttery cross-fade */}
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

            {/* Right Zone: Right Nav + Right Icons */}
            <div className="flex items-center justify-end gap-8">
              {/* Right Navigation: All Collections */}
              <nav className="hidden lg:flex items-center gap-7 text-[13px] font-medium tracking-wide">
                <Link
                  to="/collections/2026-new"
                  className="hover:opacity-80 transition-opacity relative after:absolute after:bottom-[-2px] after:left-0 after:w-full after:h-[1.5px] after:bg-current after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
                >
                  All Collections
                </Link>
              </nav>

              {/* Right Icons: Account & Cart Bag */}
              <div className="flex items-center gap-4 sm:gap-5">
                <Link
                  to="/account/login"
                  className="hidden sm:block p-1 hover:opacity-75 transition-opacity focus:outline-none"
                  aria-label="Account"
                >
                  <AccountIcon className="w-5 h-5" />
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
                          ? 'bg-[#2a3743] text-white'
                          : 'bg-white text-[#2a3743]'
                      }`}
                    >
                      {totalItems}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* 3. Dropdown Megamenus (Desktop) */}
          {/* 'New' Megamenu */}
          {activeMegamenu === 'new' && (
            <div
              className="absolute top-full left-0 w-full bg-white text-[#2a3743] border-b border-[#e5e5e5] shadow-2xl py-10 px-8 z-50 animate-in fade-in slide-in-from-top-1 duration-200"
              onMouseEnter={() => setActiveMegamenu('new')}
              onMouseLeave={() => setActiveMegamenu(null)}
            >
              <div className="max-w-[1500px] mx-auto grid grid-cols-6 gap-8 text-[13px]">
                {/* Column 1: Featured */}
                <div>
                  <h3 className="font-semibold text-[13px] tracking-wide uppercase text-neutral-900 mb-4 pb-1 border-b border-neutral-100">
                    Featured
                  </h3>
                  <ul className="space-y-3 text-neutral-600">
                    <li>
                      <Link
                        to="#all-new"
                        className="hover:text-black hover:underline transition-all"
                      >
                        All New
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="#all-new"
                        className="hover:text-black hover:underline transition-all"
                      >
                        New This Week
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="#essentials"
                        className="hover:text-black hover:underline transition-all"
                      >
                        Staff Picks
                      </Link>
                    </li>
                    <li>
                      <Link to="#hero" className="hover:text-black hover:underline transition-all">
                        Spring / Summer Edit
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Column 2: Shop By Category */}
                <div>
                  <h3 className="font-semibold text-[13px] tracking-wide uppercase text-neutral-900 mb-4 pb-1 border-b border-neutral-100">
                    Shop By Category
                  </h3>
                  <ul className="space-y-3 text-neutral-600">
                    <li>
                      <Link
                        to="#categories"
                        className="hover:text-black hover:underline transition-all"
                      >
                        New Dresses
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="#categories"
                        className="hover:text-black hover:underline transition-all"
                      >
                        New Tops
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="#categories"
                        className="hover:text-black hover:underline transition-all"
                      >
                        New Bottoms
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="#categories"
                        className="hover:text-black hover:underline transition-all"
                      >
                        New Layers
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="#mosaic"
                        className="hover:text-black hover:underline transition-all"
                      >
                        New Linen
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Column 3: Shop By Occasion */}
                <div>
                  <h3 className="font-semibold text-[13px] tracking-wide uppercase text-neutral-900 mb-4 pb-1 border-b border-neutral-100">
                    Shop By Occasion
                  </h3>
                  <ul className="space-y-3 text-neutral-600">
                    <li>
                      <Link
                        to="#essentials"
                        className="hover:text-black hover:underline transition-all"
                      >
                        Everyday Essentials
                      </Link>
                    </li>
                    <li>
                      <Link to="#promo" className="hover:text-black hover:underline transition-all">
                        Workwear
                      </Link>
                    </li>
                    <li>
                      <Link to="#hero" className="hover:text-black hover:underline transition-all">
                        Weekend
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="#mosaic"
                        className="hover:text-black hover:underline transition-all"
                      >
                        Vacation Ready
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="#essentials"
                        className="hover:text-black hover:underline transition-all"
                      >
                        Event Dressing
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Column 4: Collections */}
                <div>
                  <h3 className="font-semibold text-[13px] tracking-wide uppercase text-neutral-900 mb-4 pb-1 border-b border-neutral-100">
                    Collections
                  </h3>
                  <ul className="space-y-3 text-neutral-600">
                    <li>
                      <Link
                        to="#mosaic"
                        className="hover:text-black hover:underline transition-all"
                      >
                        The Linen Edit
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="#essentials"
                        className="hover:text-black hover:underline transition-all"
                      >
                        Minimalist Staples
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="#categories"
                        className="hover:text-black hover:underline transition-all"
                      >
                        Soft Tailoring
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="#mosaic"
                        className="hover:text-black hover:underline transition-all"
                      >
                        Neutral Tones
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="#all-new"
                        className="hover:text-black hover:underline transition-all"
                      >
                        Monochrome Looks
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Promo Card 1: Linen Favorites */}
                <div className="flex flex-col group/card cursor-pointer">
                  <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2px] bg-neutral-100 mb-3">
                    <img
                      src="/images/dfine-img-000.png"
                      alt="Linen Favorites"
                      className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                  <h4 className="font-semibold text-[13px] text-neutral-900 group-hover/card:text-black">
                    Linen Favorites
                  </h4>
                  <p className="text-[12px] text-neutral-500 mt-0.5 leading-snug">
                    Breathable, relaxed pieces for everyday wear
                  </p>
                </div>

                {/* Promo Card 2: The Wren Coat */}
                <div className="flex flex-col group/card cursor-pointer">
                  <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2px] bg-neutral-100 mb-3">
                    <img
                      src="/images/dfine-img-001.png"
                      alt="The Wren Coat"
                      className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                  <h4 className="font-semibold text-[13px] text-neutral-900">New This Week</h4>
                  <span className="inline-block mt-1 text-[11px] font-semibold uppercase tracking-wider text-neutral-800 underline underline-offset-2">
                    The Wren Coat
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 'Clothing' Megamenu */}
          {activeMegamenu === 'clothing' && (
            <div
              className="absolute top-full left-0 w-full bg-white text-[#2a3743] border-b border-[#e5e5e5] shadow-2xl py-10 px-8 z-50 animate-in fade-in slide-in-from-top-1 duration-200"
              onMouseEnter={() => setActiveMegamenu('clothing')}
              onMouseLeave={() => setActiveMegamenu(null)}
            >
              <div className="max-w-[1500px] mx-auto grid grid-cols-5 gap-8 text-[13px]">
                {/* Category 1: Tops */}
                <div>
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[2px] bg-neutral-100 mb-3 group/item">
                    <img
                      src="/images/dfine-img-003.jpg"
                      alt="Tops"
                      className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="font-semibold text-[13px] tracking-wide uppercase text-neutral-900 mb-3 pb-1 border-b border-neutral-100">
                    Tops
                  </h3>
                  <ul className="space-y-2.5 text-neutral-600">
                    <li>
                      <Link
                        to="#all-new"
                        className="hover:text-black hover:underline transition-all"
                      >
                        Tees
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="#essentials"
                        className="hover:text-black hover:underline transition-all"
                      >
                        Shirts
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="#all-new"
                        className="hover:text-black hover:underline transition-all"
                      >
                        Knit Tops
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Category 2: Bottoms */}
                <div>
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[2px] bg-neutral-100 mb-3 group/item">
                    <img
                      src="/images/dfine-img-004.jpg"
                      alt="Bottoms"
                      className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="font-semibold text-[13px] tracking-wide uppercase text-neutral-900 mb-3 pb-1 border-b border-neutral-100">
                    Bottoms
                  </h3>
                  <ul className="space-y-2.5 text-neutral-600">
                    <li>
                      <Link
                        to="#essentials"
                        className="hover:text-black hover:underline transition-all"
                      >
                        Trousers
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="#essentials"
                        className="hover:text-black hover:underline transition-all"
                      >
                        Skirts
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="#essentials"
                        className="hover:text-black hover:underline transition-all"
                      >
                        Shorts
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Category 3: Dresses */}
                <div>
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[2px] bg-neutral-100 mb-3 group/item">
                    <img
                      src="/images/dfine-img-005.jpg"
                      alt="Dresses"
                      className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="font-semibold text-[13px] tracking-wide uppercase text-neutral-900 mb-3 pb-1 border-b border-neutral-100">
                    Dresses
                  </h3>
                  <ul className="space-y-2.5 text-neutral-600">
                    <li>
                      <Link to="#promo" className="hover:text-black hover:underline transition-all">
                        Casual Dresses
                      </Link>
                    </li>
                    <li>
                      <Link to="#promo" className="hover:text-black hover:underline transition-all">
                        Midi Dresses
                      </Link>
                    </li>
                    <li>
                      <Link to="#promo" className="hover:text-black hover:underline transition-all">
                        Occasion Dresses
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Category 4: Layers */}
                <div>
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[2px] bg-neutral-100 mb-3 group/item">
                    <img
                      src="/images/dfine-img-006.jpg"
                      alt="Layers"
                      className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="font-semibold text-[13px] tracking-wide uppercase text-neutral-900 mb-3 pb-1 border-b border-neutral-100">
                    Layers
                  </h3>
                  <ul className="space-y-2.5 text-neutral-600">
                    <li>
                      <Link to="#promo" className="hover:text-black hover:underline transition-all">
                        Blazers
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="#all-new"
                        className="hover:text-black hover:underline transition-all"
                      >
                        Jackets
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="#all-new"
                        className="hover:text-black hover:underline transition-all"
                      >
                        Cardigans
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="#all-new"
                        className="hover:text-black hover:underline transition-all"
                      >
                        Sweaters
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Category 5: Linen */}
                <div>
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[2px] bg-neutral-100 mb-3 group/item">
                    <img
                      src="/images/dfine-img-007.jpg"
                      alt="Linen"
                      className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="font-semibold text-[13px] tracking-wide uppercase text-neutral-900 mb-3 pb-1 border-b border-neutral-100">
                    Linen
                  </h3>
                  <ul className="space-y-2.5 text-neutral-600">
                    <li>
                      <Link
                        to="#mosaic"
                        className="hover:text-black hover:underline transition-all"
                      >
                        Linen Dresses
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="#mosaic"
                        className="hover:text-black hover:underline transition-all"
                      >
                        Linen Shirts
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="#mosaic"
                        className="hover:text-black hover:underline transition-all"
                      >
                        Linen Pants
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="#mosaic"
                        className="hover:text-black hover:underline transition-all"
                      >
                        Linen Shorts
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="#mosaic"
                        className="hover:text-black hover:underline transition-all"
                      >
                        Linen Layers
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </header>
      </div>
    </>
  );
}
