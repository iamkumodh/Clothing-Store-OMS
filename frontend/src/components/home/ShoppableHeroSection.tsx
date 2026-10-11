/**
 * Shoppable Hero Banner Section - T-Shirt Brand Campaign
 */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { shoppableHotspots } from '../common/data';
import { useDfineStore } from '../../context/store-context';
import { ChevronRightIcon } from '../common/icons';

export function ShoppableHeroSection() {
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const { addToCart } = useDfineStore();

  return (
    <section className="relative w-full bg-white overflow-hidden select-none">
      <div className="relative w-full aspect-[1000/1087] sm:aspect-[1582/994] overflow-hidden">
        {/* Mobile Campaign Banner (under 640px) */}
        <div className="block sm:hidden absolute inset-0">
          <img
            src="/images/dfine-hero-mobile.png"
            alt="The Heavyweight Series - D'fine T-Shirts"
            className="w-full h-full object-cover object-top select-none"
            loading="lazy"
          />
        </div>

        {/* Desktop Campaign Banner (640px and up) */}
        <div className="hidden sm:block absolute inset-0">
          <img
            src="/images/dfine-img-010.png"
            alt="The Heavyweight Series - D'fine T-Shirts"
            className="w-full h-full object-cover object-top select-none"
            loading="lazy"
          />
        </div>

        {/* Contrast gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />

        {/* Shoppable Hotspot Pins */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          {shoppableHotspots.map(spot => {
            const isSelected = activeHotspot === spot.id;
            return (
              <div
                key={spot.id}
                className="absolute pointer-events-auto max-sm:[top:var(--mobile-y)] max-sm:[left:var(--mobile-x)] sm:[top:var(--desktop-y)] sm:[left:var(--desktop-x)]"
                style={
                  {
                    '--mobile-y': `${spot.mobileY ?? spot.y}%`,
                    '--mobile-x': `${spot.mobileX ?? spot.x}%`,
                    '--desktop-y': `${spot.y}%`,
                    '--desktop-x': `${spot.x}%`,
                  } as React.CSSProperties
                }
              >
                <div className="relative -translate-x-1/2 -translate-y-1/2">
                  <button
                    onClick={() => setActiveHotspot(isSelected ? null : spot.id)}
                    onMouseEnter={() => setActiveHotspot(spot.id)}
                    className="w-10 h-10 rounded-full bg-white/95 text-black hover:bg-white hover:scale-110 flex items-center justify-center shadow-md border border-zinc-200 transition-all duration-200 focus:outline-none cursor-pointer"
                    aria-label={`View ${spot.product.title}`}
                  >
                    <svg
                      aria-hidden="true"
                      focusable="false"
                      className="w-3.5 h-3.5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M17.409 8.929h-6.695V2.258c0-.566-.506-1.029-1.071-1.029s-1.071.463-1.071 1.029v6.671H1.967C1.401 8.929.938 9.435.938 10s.463 1.071 1.029 1.071h6.605V17.7c0 .566.506 1.029 1.071 1.029s1.071-.463 1.071-1.029v-6.629h6.695c.566 0 1.029-.506 1.029-1.071s-.463-1.071-1.029-1.071z" />
                    </svg>
                  </button>

                  {/* Hotspot Tooltip */}
                  {isSelected && (
                    <div
                      onMouseLeave={() => setActiveHotspot(null)}
                      className="absolute left-1/2 -translate-x-1/2 top-12 z-30 bg-white text-[#0a0a0a] border border-zinc-200 p-3 rounded-[2px] shadow-2xl flex flex-col gap-2 w-[230px] animate-in fade-in zoom-in-95 duration-150"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="relative w-10 h-14 bg-zinc-100 rounded-[2px] overflow-hidden shrink-0 border border-zinc-200">
                          <img
                            src={spot.product.image}
                            alt={spot.product.title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                            {spot.product.gsm ? `${spot.product.gsm} GSM • ` : ''}{spot.product.gender}
                          </span>
                          <p className="text-[13px] font-medium truncate text-[#0a0a0a]">
                            {spot.product.title}
                          </p>
                          <p className="text-[12px] font-semibold text-neutral-900 mt-0.5">
                            LKR {Number(spot.product.price).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="pt-1.5 border-t border-zinc-100 flex items-center justify-between">
                        <button
                          onClick={() => addToCart(spot.product, 1)}
                          className="text-[11px] font-semibold text-[#0a0a0a] hover:text-neutral-600 uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                        >
                          <span>Add to bag</span>
                          <ChevronRightIcon className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Hero Editorial Content */}
        <div className="absolute bottom-0 left-0 z-20 p-8 sm:p-10 lg:p-12 max-w-[700px] text-white">
          <span className="inline-block px-2.5 py-1 mb-3 text-[11px] font-bold uppercase tracking-[0.2em] bg-white/20 backdrop-blur-xs rounded-xs border border-white/30 text-white">
            2026 T-Shirt Drop
          </span>
          <h2 className="text-[32px] sm:text-[40px] font-medium leading-[1.08] tracking-tight font-sans drop-shadow-sm">
            The Heavyweight Series
          </h2>
          <p className="text-[14px] sm:text-[15px] font-light leading-relaxed text-white/90 drop-shadow-sm mt-2 mb-6 max-w-[500px]">
            240–260 GSM combed cotton. Drop-shoulder silhouettes engineered for structured drape, shape retention, and everyday streetwear.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/collections/men"
              className="inline-flex items-center justify-center px-5 py-2.5 bg-white text-black hover:bg-zinc-100 transition-colors text-[12px] font-bold tracking-[0.15em] uppercase rounded-full shadow-sm"
            >
              Shop Men
            </Link>
            <Link
              to="/collections/women"
              className="inline-flex items-center justify-center px-5 py-2.5 bg-white text-black hover:bg-zinc-100 transition-colors text-[12px] font-bold tracking-[0.15em] uppercase rounded-full shadow-sm"
            >
              Shop Women
            </Link>
            <Link
              to="/collections/unisex"
              className="inline-flex items-center justify-center px-5 py-2.5 bg-black/40 hover:bg-black/60 border border-white/40 text-white transition-colors text-[12px] font-bold tracking-[0.15em] uppercase rounded-full backdrop-blur-xs shadow-sm"
            >
              Shop Unisex
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
