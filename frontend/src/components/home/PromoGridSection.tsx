/**
 * Seasonal Promotional Grid Section
 */
import React from 'react';
import { Link } from 'react-router-dom';

export function PromoGridSection() {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Dresses */}
          <div className="relative aspect-[4/5] rounded-[2px] overflow-hidden bg-[#f0ede6] flex flex-col justify-end p-8 sm:p-12 text-white">
            <img
              src="/images/dfine-img-032.jpg"
              alt="Dresses for every day"
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            <div className="relative z-10 space-y-4 max-w-[420px]">
              <h2 className="text-3xl sm:text-4xl font-normal tracking-tight">
                Dresses for every day
              </h2>
              <p className="text-[14px] text-white/90 font-light leading-relaxed">
                Breathable linen wraps and easy slip silhouettes cut for warm breezes and relaxed
                afternoons.
              </p>
              <div>
                <Link
                  to="/collections/2026-new"
                  className="inline-flex items-center justify-center px-6 py-3 bg-white text-[#2a3743] hover:bg-neutral-100 transition-colors text-[12px] font-semibold tracking-wider uppercase rounded-[2px]"
                >
                  Shop Dresses
                </Link>
              </div>
            </div>
          </div>

          {/* Card 2: Thoughtful Layers */}
          <div className="relative aspect-[4/5] rounded-[2px] overflow-hidden bg-[#f0ede6] flex flex-col justify-end p-8 sm:p-12 text-white">
            <img
              src="/images/dfine-img-033.jpg"
              alt="Thoughtful layers"
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            <div className="relative z-10 space-y-4 max-w-[420px]">
              <h2 className="text-3xl sm:text-4xl font-normal tracking-tight">Thoughtful layers</h2>
              <p className="text-[14px] text-white/90 font-light leading-relaxed">
                Lightweight cardigans and tailored overshirts that adapt effortlessly between
                morning shade and midday sun.
              </p>
              <div>
                <Link
                  to="/collections/2026-new"
                  className="inline-flex items-center justify-center px-6 py-3 bg-white text-[#2a3743] hover:bg-neutral-100 transition-colors text-[12px] font-semibold tracking-wider uppercase rounded-[2px]"
                >
                  Shop Layers
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
