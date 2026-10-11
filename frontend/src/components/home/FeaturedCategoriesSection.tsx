/**
 * Featured T-Shirt Categories Section (3 Core Pillars: Men, Women, Unisex)
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { featuredCategories } from '../common/data';

export function FeaturedCategoriesSection() {
  return (
    <section className="py-16 bg-white border-b border-zinc-100">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8">
        <div className="flex flex-col items-center text-center mb-10">
          <span className="text-[11px] font-bold tracking-[0.2em] text-neutral-400 uppercase">
            Curated Categories
          </span>
          <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-neutral-900 mt-1">
            Shop by Silhouette & Gender
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredCategories.map((cat, idx) => (
            <Link
              key={idx}
              to={cat.href}
              className="group relative aspect-[3/4] sm:aspect-[4/5] rounded-[2px] overflow-hidden bg-neutral-100 border border-zinc-200 flex flex-col justify-end p-6 text-white shadow-xs hover:shadow-md transition-shadow"
            >
              <img
                src={cat.image}
                alt={cat.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />

              <div className="relative z-10 flex items-end justify-between">
                <div>
                  <span className="text-[11px] uppercase tracking-widest font-semibold text-white/80">
                    Collection
                  </span>
                  <h3 className="text-2xl font-semibold tracking-wide text-white mt-0.5">
                    {cat.title}
                  </h3>
                </div>

                <span className="inline-flex items-center text-[11px] font-bold uppercase tracking-wider bg-white/20 hover:bg-white text-white hover:text-black px-3.5 py-1.5 rounded-full backdrop-blur-xs transition-colors">
                  Explore →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
