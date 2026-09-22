/**
 * Featured Categories Carousel Section
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { featuredCategories } from '../common/data';

export function FeaturedCategoriesSection() {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {featuredCategories.map((cat, idx) => (
            <Link
              key={idx}
              to={cat.href}
              className="group relative aspect-[3/4] rounded-[2px] overflow-hidden bg-[#edebe7] flex flex-col justify-end p-5 text-white"
            >
              <img
                src={cat.image}
                alt={cat.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

              <div className="relative z-10">
                <span className="text-[11px] uppercase tracking-widest font-light text-white/80">
                  Shop
                </span>
                <h3 className="text-xl font-semibold tracking-wide capitalize">{cat.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
