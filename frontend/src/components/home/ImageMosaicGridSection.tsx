/**
 * Lifestyle Image Mosaic Grid Section - T-Shirt Styling Stories
 */
import React from 'react';
import { Link } from 'react-router-dom';

export function ImageMosaicGridSection() {
  const tiles = [
    {
      title: 'Heavyweight Boxy Blanks',
      subtitle: '260 GSM Structured',
      image: '/images/coll-the-base-crew.png',
      span: 'col-span-1',
      link: '/collections/all?gsm=260',
    },
    {
      title: 'Boxy Cropped Cuts',
      subtitle: 'Women’s Streetwear',
      image: '/images/coll-the-ines-tee.png',
      span: 'col-span-1',
      link: '/collections/women?fit=Boxy+Cropped',
    },
    {
      title: 'Graphic Drops',
      subtitle: 'Tokyo Drift & Cyberpunk',
      image: '/images/coll-the-nico-tee.png',
      span: 'col-span-1',
      link: '/collections/unisex?category=Graphic+Tees',
    },
    {
      title: 'Yarn-Dyed Stripe Series',
      subtitle: 'Double-Knitted Cotton',
      image: '/images/coll-the-finn-stripe-tee.png',
      span: 'col-span-1',
      link: '/collections/men',
    },
    {
      title: 'Vintage Garment Washed',
      subtitle: 'Soft Lived-in Texture',
      image: '/images/coll-the-form-long-sleeve.png',
      span: 'col-span-1 sm:col-span-2',
      link: '/collections/all?category=Vintage+Washed',
    },
    {
      title: 'Everyday Pima Basics',
      subtitle: '180 GSM Pure Comfort',
      image: '/images/coll-the-rib-tee.png',
      span: 'col-span-1 sm:col-span-2',
      link: '/collections/all?gsm=180',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8">
        <div className="flex flex-col items-center text-center mb-12">
          <span className="text-[11px] font-bold tracking-[0.2em] text-neutral-400 uppercase">
            Stylebook & Edits
          </span>
          <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-neutral-900 mt-1">
            Engineered for Everyday Styling
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {tiles.map((tile, idx) => (
            <Link
              key={idx}
              to={tile.link}
              className={`group relative aspect-[4/3] rounded-[2px] overflow-hidden bg-neutral-100 border border-zinc-200 flex flex-col justify-end p-5 text-white ${tile.span}`}
            >
              <img
                src={tile.image}
                alt={tile.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent transition-opacity group-hover:opacity-90" />

              <div className="relative z-10">
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/70 block mb-0.5">
                  {tile.subtitle}
                </span>
                <span className="text-base sm:text-lg font-semibold tracking-wide text-white">
                  {tile.title}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
