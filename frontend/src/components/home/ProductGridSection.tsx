/**
 * Curated Product Grid Section
 */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../common/types';
import { useDfineStore } from '../../context/store-context';

export function ProductGridSection({
  id,
  title,
  subtitle,
  products,
}: {
  id?: string;
  title: string;
  subtitle?: string;
  products: Product[];
}) {
  const { setQuickViewProduct } = useDfineStore();

  return (
    <section id={id} className="py-16 bg-white border-t border-zinc-200">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8">
        <div className="flex items-end justify-between mb-8 pb-3 border-b border-zinc-200">
          <div>
            {subtitle && (
              <span className="text-[11px] uppercase tracking-widest text-zinc-500 font-bold block mb-1">
                {subtitle}
              </span>
            )}
            <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-[#0a0a0a]">
              {title}
            </h2>
          </div>
          <Link
            to="/collections/2026-new"
            className="text-[13px] font-medium text-[#0a0a0a] hover:underline underline-offset-4"
          >
            View all
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={() => setQuickViewProduct(product)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product, onQuickView }: { product: Product; onQuickView: () => void }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group flex flex-col bg-white overflow-hidden transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[3/4] w-full bg-zinc-100 rounded-[2px] overflow-hidden border border-zinc-100">
        <img
          src={isHovered && product.hoverImage ? product.hoverImage : product.image}
          alt={product.title}
          className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-95"
          loading="lazy"
        />

        {/* Badge */}
        {product.badge && (
          <span
            className={`absolute top-0 right-0 z-10 text-[11px] uppercase font-semibold tracking-wider px-2.5 py-1 ${
              product.badge === 'Sale'
                ? 'bg-black text-white'
                : 'bg-white text-black border-b border-l border-zinc-200'
            }`}
          >
            {product.badge}
          </span>
        )}

        {/* Quick View Button (Exact 1:1 D'fine Theme) */}
        <button
          type="button"
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            onQuickView();
          }}
          className="absolute bottom-[10px] left-[10px] right-[10px] w-[calc(100%-20px)] z-20 bg-black hover:bg-zinc-800 text-white text-[13px] font-medium tracking-[0.35px] py-2 px-1 text-center opacity-0 translate-y-[5px] group-hover:opacity-100 group-hover:translate-y-0 transition-[opacity,transform,background-color] duration-250 ease-out cursor-pointer rounded-none"
        >
          Quick View
        </button>
      </div>

      <div className="pt-3 pb-1 flex-1 flex flex-col justify-between">
        <div>
          {(product.gsm || product.gender) && (
            <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-0.5">
              {product.gsm ? `${product.gsm} GSM` : ''}
              {product.gsm && product.gender ? ' • ' : ''}
              {product.gender || ''}
            </div>
          )}
          <Link to={`/products/${product.handle}`} className="block">
            <h3 className="text-[14px] font-medium text-[#0a0a0a] hover:underline underline-offset-4 line-clamp-1">
              {product.title}
            </h3>
          </Link>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-semibold text-[#0a0a0a] font-mono">
              LKR {Number(product.price).toLocaleString()}
            </span>
            {product.compareAtPrice && (
              <span className="text-[12px] text-zinc-500 line-through font-mono">
                LKR {Number(product.compareAtPrice).toLocaleString()}
              </span>
            )}
          </div>

          {product.colors && (
            <div className="flex items-center gap-1">
              {product.colors.map((color, idx) => (
                <span
                  key={idx}
                  className="w-2.5 h-2.5 rounded-full border border-black/15"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
