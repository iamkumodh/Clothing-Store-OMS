/**
 * Seasonal Promotional Grid Section - T-Shirt Craft Stories
 */
import React from 'react';
import { Link } from 'react-router-dom';

export function PromoGridSection() {
  return (
    <section className="py-16 bg-white border-b border-zinc-100">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: The Graphic Series */}
          <div className="relative aspect-[4/5] rounded-[2px] overflow-hidden bg-neutral-900 flex flex-col justify-end p-8 sm:p-12 text-white border border-zinc-200">
            <img
              src="/images/coll-the-nico-tee.png"
              alt="The High-Density Graphic Series"
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

            <div className="relative z-10 space-y-4 max-w-[440px]">
              <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-neutral-300 bg-white/10 px-2.5 py-1 rounded-xs backdrop-blur-xs">
                Limited Batch Drops
              </span>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">
                The High-Density Graphic Series
              </h2>
              <p className="text-[14px] text-white/90 font-light leading-relaxed">
                Statement typography and screen-printed artworks built on 240 GSM pre-shrunk combed cotton with drop-shoulder streetwear cuts.
              </p>
              <div>
                <Link
                  to="/collections/unisex?category=Graphic+Tees"
                  className="inline-flex items-center justify-center px-6 py-3 bg-white text-black hover:bg-neutral-100 transition-colors text-[12px] font-bold tracking-wider uppercase rounded-[2px]"
                >
                  Shop Graphic Tees
                </Link>
              </div>
            </div>
          </div>

          {/* Card 2: Vintage Washed Series */}
          <div className="relative aspect-[4/5] rounded-[2px] overflow-hidden bg-neutral-900 flex flex-col justify-end p-8 sm:p-12 text-white border border-zinc-200">
            <img
              src="/images/coll-the-form-long-sleeve.png"
              alt="Vintage Pigment-Dyed & Acid Wash"
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

            <div className="relative z-10 space-y-4 max-w-[440px]">
              <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-neutral-300 bg-white/10 px-2.5 py-1 rounded-xs backdrop-blur-xs">
                Garment-Dyed Patina
              </span>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">
                Vintage Pigment & Acid Wash
              </h2>
              <p className="text-[14px] text-white/90 font-light leading-relaxed">
                Enzyme-washed for a velvet-soft hand feel and subtle weathered patina. Lived-in character from day one that only gets better with time.
              </p>
              <div>
                <Link
                  to="/collections/all?category=Vintage+Washed"
                  className="inline-flex items-center justify-center px-6 py-3 bg-white text-black hover:bg-neutral-100 transition-colors text-[12px] font-bold tracking-wider uppercase rounded-[2px]"
                >
                  Shop Washed Series
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
