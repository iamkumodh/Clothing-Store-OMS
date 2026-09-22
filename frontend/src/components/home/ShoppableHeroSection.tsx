/**
 * Shoppable Hero Banner Section
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
    <section className="relative w-full bg-[#f4f2ee] overflow-hidden select-none">
      {/* 
        Official D'fine Media Container:
        Responsive aspect ratio: 1000/1087 on mobile, 1582/994 on desktop
        Preserves top sunlit wall space so the D'fine logo never collides with models' heads.
      */}
      <div className="relative w-full aspect-[1000/1087] sm:aspect-[1582/994] overflow-hidden">
        {/* Mobile Campaign Banner (under 640px) */}
        <div className="block sm:hidden absolute inset-0">
          <img
            src="/images/dfine-hero-mobile.png"
            alt="Easy by design - D'fine Campaign"
            className="w-full h-full object-cover object-top select-none"
            loading="lazy"
          />
        </div>

        {/* Desktop Campaign Banner (640px and up) */}
        <div className="hidden sm:block absolute inset-0">
          <img
            src="/images/dfine-img-010.png"
            alt="Easy by design - D'fine Campaign"
            className="w-full h-full object-cover object-top select-none"
            loading="lazy"
          />
        </div>

        {/* Subtle vignette gradient on bottom-left for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

        {/* Shoppable Hotspot Pins (Official 40px Ivory Plus Buttons) */}
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
                    className="w-10 h-10 rounded-full bg-[#edebe7] text-[#444] hover:bg-white hover:scale-110 flex items-center justify-center shadow-md transition-all duration-200 focus:outline-none cursor-pointer"
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

                  {/* Hotspot Floating Tooltip */}
                  {isSelected && (
                    <div
                      onMouseLeave={() => setActiveHotspot(null)}
                      className="absolute left-1/2 -translate-x-1/2 top-12 z-30 bg-white text-[#2a3743] border border-[#e5e5e5] p-3 rounded-[2px] shadow-2xl flex flex-col gap-2 w-[220px] animate-in fade-in zoom-in-95 duration-150"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="relative w-10 h-14 bg-[#edebe7] rounded-[2px] overflow-hidden shrink-0">
                          <img
                            src={spot.product.image}
                            alt={spot.product.title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-medium truncate text-[#2a3743]">
                            {spot.product.title}
                          </p>
                          <p className="text-[12px] font-normal text-neutral-600 mt-0.5">
                            ${spot.product.price}
                          </p>
                        </div>
                      </div>

                      <div className="pt-1 border-t border-neutral-100 flex items-center justify-between">
                        <button
                          onClick={() => addToCart(spot.product, 1)}
                          className="text-[11px] font-semibold text-[#2a3743] hover:text-black uppercase tracking-wider flex items-center gap-1"
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

        {/* 
          Official D'fine Hero Editorial Content:
          Positioned bottom-left with exactly 40px padding and exact typography
        */}
        <div className="absolute bottom-0 left-0 z-20 p-8 sm:p-10 lg:p-12 max-w-[650px] text-white">
          <h2 className="text-[27px] font-medium leading-[1.1] tracking-normal font-sans drop-shadow-sm normal-case">
            Easy by design
          </h2>
          <p className="text-[15px] font-light leading-relaxed text-white/90 drop-shadow-sm mt-2 mb-5 max-w-[460px]">
            Soft texture, effortless movement, warm-weather pieces designed to be worn on repeat.
          </p>

          <Link
            to="/collections/2026-new"
            className="inline-flex items-center justify-center px-6 py-2.5 bg-[#edebe7] text-black hover:bg-white transition-colors text-[13px] font-bold tracking-[0.2em] uppercase rounded-full shadow-sm"
          >
            Shop Linen
          </Link>
        </div>
      </div>
    </section>
  );
}
