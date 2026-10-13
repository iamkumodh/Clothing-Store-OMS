/**
 * Lifestyle Image Mosaic Grid Section - Streetwear Styling Stories
 */
import React from 'react';
import { Link } from 'react-router-dom';

export function ImageMosaicGridSection() {
  const tiles = [
    {
      title: 'SPANDEX — B1',
      subtitle: '240 GSM Pitch Black Stretch',
      image: '/images/products/spx-b1-1.webp',
      span: 'col-span-1',
      link: '/collections/spandex',
    },
    {
      title: 'SPANDEX — DB1',
      subtitle: '260 GSM Washed Charcoal',
      image: '/images/products/spx-db1-1.webp',
      span: 'col-span-1',
      link: '/collections/spandex',
    },
    {
      title: 'SPANDEX — W1',
      subtitle: '240 GSM Pure White',
      image: '/images/products/spx-w1-1.webp',
      span: 'col-span-1',
      link: '/collections/spandex',
    },
    {
      title: 'TERRY — G1',
      subtitle: '260 GSM Olive Green Micro-Loop',
      image: '/images/products/try-g1-1.webp',
      span: 'col-span-1',
      link: '/collections/terry',
    },
    {
      title: 'TERRY — LB1',
      subtitle: '260 GSM Muted Light Blue',
      image: '/images/products/try-lb1-1.webp',
      span: 'col-span-1 sm:col-span-2',
      link: '/collections/terry',
    },
    {
      title: '2026 Streetwear Editorial',
      subtitle: 'Spandex • French Terry • Dye',
      image: '/images/hero-streetwear-portrait.webp',
      span: 'col-span-1 sm:col-span-2',
      link: '/collections/all',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8">
        <div className="flex flex-col items-center text-center mb-12">
          <span className="text-[11px] font-bold tracking-[0.2em] text-neutral-400 uppercase">
            Stylebook & Lookbook
          </span>
          <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-neutral-900 mt-1">
            Streetwear Silhouettes in Motion
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tiles.map((tile, idx) => (
            <Link
              key={idx}
              to={tile.link}
              className={`group relative overflow-hidden rounded-[2px] bg-neutral-900 aspect-[3/4] ${tile.span} border border-zinc-200 shadow-xs hover:shadow-md transition-shadow`}
            >
              <img
                src={tile.image}
                alt={tile.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent pointer-events-none" />

              <div className="absolute bottom-0 left-0 p-5 text-white z-10">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-300">
                  {tile.subtitle}
                </span>
                <h3 className="text-lg font-semibold text-white mt-0.5">
                  {tile.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
