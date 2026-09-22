/**
 * Lifestyle Image Mosaic Grid Section
 */
import React from 'react';
import { Link } from 'react-router-dom';

export function ImageMosaicGridSection() {
  const tiles = [
    { title: 'The Linen Edit', image: '/images/dfine-img-007.jpg', span: 'col-span-1' },
    { title: 'Soft Neutrals', image: '/images/dfine-img-004.jpg', span: 'col-span-1' },
    { title: 'Everyday Dresses', image: '/images/dfine-img-005.jpg', span: 'col-span-1' },
    { title: 'Thoughtful Layers', image: '/images/dfine-img-006.jpg', span: 'col-span-1' },
    {
      title: 'Tailored Outerwear',
      image: '/images/dfine-img-002.png',
      span: 'col-span-1 sm:col-span-2',
    },
    {
      title: 'Breathable Linens',
      image: '/images/dfine-img-001.png',
      span: 'col-span-1 sm:col-span-2',
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {tiles.map((tile, idx) => (
            <Link
              key={idx}
              to="/collections/2026-new"
              className={`group relative aspect-[4/3] rounded-[2px] overflow-hidden bg-neutral-200 flex items-end p-5 text-white ${tile.span}`}
            >
              <img
                src={tile.image}
                alt={tile.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />

              <span className="relative z-10 text-base sm:text-lg font-semibold tracking-wide capitalize">
                {tile.title}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
