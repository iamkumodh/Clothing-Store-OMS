/**
 * Seasonal Promotional Grid Section - Streetwear Craft Stories
 */
import React from 'react';
import { Link } from 'react-router-dom';

export function PromoGridSection() {
  return (
    <section className="py-16 bg-white border-b border-zinc-100">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Spandex Series */}
          <div className="relative aspect-[4/5] rounded-[2px] overflow-hidden bg-neutral-900 flex flex-col justify-end p-8 sm:p-12 text-white border border-zinc-200">
            <img
              src="/images/products/spx-db1-1.webp"
              alt="The Spandex Heavyweight Series"
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

            <div className="relative z-10 space-y-4 max-w-[440px]">
              <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-neutral-300 bg-white/10 px-2.5 py-1 rounded-xs backdrop-blur-xs">
                Precision Stretch & Drape
              </span>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">
                The Spandex Series
              </h2>
              <p className="text-[14px] text-white/90 font-light leading-relaxed">
                Engineered with high-grade elastane stretch blends for clean architectural drape, reinforced collar shape retention, and uncompromising comfort.
              </p>
              <div>
                <Link
                  to="/collections/spandex"
                  className="inline-flex items-center justify-center px-6 py-3 bg-white text-black hover:bg-neutral-100 transition-colors text-[12px] font-bold tracking-wider uppercase rounded-[2px]"
                >
                  Shop Spandex Series
                </Link>
              </div>
            </div>
          </div>

          {/* Card 2: French Terry & Garment Dye Series */}
          <div className="relative aspect-[4/5] rounded-[2px] overflow-hidden bg-neutral-900 flex flex-col justify-end p-8 sm:p-12 text-white border border-zinc-200">
            <img
              src="/images/products/try-g1-1.webp"
              alt="French Terry & Garment Dye Series"
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

            <div className="relative z-10 space-y-4 max-w-[440px]">
              <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-neutral-300 bg-white/10 px-2.5 py-1 rounded-xs backdrop-blur-xs">
                Micro-Loop Texture & Vintage Dye
              </span>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">
                French Terry & Dye
              </h2>
              <p className="text-[14px] text-white/90 font-light leading-relaxed">
                Substantial 260 GSM French Terry knit with interior micro-loop comfort, alongside authentic pigment-dyed vintage washes with individual lived-in patina.
              </p>
              <div>
                <Link
                  to="/collections/terry"
                  className="inline-flex items-center justify-center px-6 py-3 bg-white text-black hover:bg-neutral-100 transition-colors text-[12px] font-bold tracking-wider uppercase rounded-[2px]"
                >
                  Shop Terry & Dye
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
