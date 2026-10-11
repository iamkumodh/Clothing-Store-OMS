/**
 * Full-Width Featured Promo Banner
 */
import React from 'react';
import { Link } from 'react-router-dom';

export function SlideshowBannerSection() {
  return (
    <section className="relative w-full h-[65vh] sm:h-[75vh] bg-black text-white flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="/images/dfine-img-000.png"
          alt="Easy to wear, easy to return to"
          className="w-full h-full object-cover brightness-85"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative z-10 max-w-[700px] text-center px-6 space-y-4">
        <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-zinc-200">
          The Linen Standard
        </span>
        <h2 className="text-3xl sm:text-5xl font-normal tracking-tight text-white leading-[1.1]">
          Easy to wear, easy to return to
        </h2>
        <p className="text-[15px] sm:text-[16px] text-white/90 font-light max-w-[480px] mx-auto">
          Soft linen blends that breathe effortlessly and hold shape season after season.
        </p>
        <div className="pt-4">
          <Link
            to="/collections/2026-new"
            className="inline-flex items-center justify-center px-8 py-3.5 bg-white text-black hover:bg-zinc-100 transition-colors text-[12px] font-semibold tracking-wider uppercase rounded-[2px]"
          >
            Shop Dresses
          </Link>
        </div>
      </div>
    </section>
  );
}
