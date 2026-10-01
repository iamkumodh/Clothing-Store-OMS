/**
 * Product Quick View Modal
 */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDfineStore } from '../../context/store-context';
import { X, Check } from 'lucide-react';

export function QuickViewModal() {
  const { quickViewProduct, setQuickViewProduct, addToCart, setIsCartOpen } = useDfineStore();
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [added, setAdded] = useState(false);

  if (!quickViewProduct) return null;

  const images =
    quickViewProduct.images && quickViewProduct.images.length > 0
      ? quickViewProduct.images
      : ([quickViewProduct.image, quickViewProduct.hoverImage].filter(Boolean) as string[]);

  const currentImage = images[selectedImageIndex] || quickViewProduct.image;

  const handleAdd = () => {
    addToCart(quickViewProduct, 1, undefined, selectedSize || quickViewProduct.sizes?.[0]);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      setQuickViewProduct(null);
      setIsCartOpen(true);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-white text-[#0a0a0a] max-w-4xl w-full shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 rounded-none max-h-[90vh] overflow-y-auto border border-zinc-200">
        {/* Close Button */}
        <button
          onClick={() => {
            setQuickViewProduct(null);
            setSelectedImageIndex(0);
          }}
          className="absolute top-4 right-4 z-20 p-2 text-zinc-500 hover:text-black transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Gallery / Image Column */}
        <div className="md:col-span-6 bg-zinc-50 p-6 flex flex-col justify-center items-center border-b md:border-b-0 md:border-r border-zinc-200">
          <div className="relative aspect-[3/4] w-full max-w-md bg-zinc-100 overflow-hidden border border-zinc-200">
            <img
              src={currentImage}
              alt={quickViewProduct.title}
              className="w-full h-full object-cover"
            />
          </div>

          {images.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto w-full max-w-md">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImageIndex(i)}
                  className={`relative w-14 h-18 shrink-0 border transition-all cursor-pointer ${
                    selectedImageIndex === i
                      ? 'border-black ring-1 ring-black'
                      : 'border-zinc-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${quickViewProduct.title} thumbnail ${i + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info Column */}
        <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between">
          <div className="space-y-4">
            {quickViewProduct.category && (
              <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-zinc-500">
                {quickViewProduct.category}
              </span>
            )}

            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#0a0a0a] tracking-tight">
              {quickViewProduct.title}
            </h2>

            <div className="flex items-center gap-2">
              <span className="text-xl font-normal text-[#0a0a0a]">
                LKR {Number(quickViewProduct.price).toLocaleString()}
              </span>
              {quickViewProduct.compareAtPrice &&
                quickViewProduct.compareAtPrice > quickViewProduct.price && (
                  <span className="text-sm text-zinc-500 line-through">
                    LKR {Number(quickViewProduct.compareAtPrice).toLocaleString()}
                  </span>
                )}
            </div>

            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed border-t border-b border-zinc-200 py-3">
              {quickViewProduct.description ||
                'Designed with clean, relaxed tailoring in breathable natural textiles for everyday rotation.'}
            </p>

            {/* Size Options */}
            {quickViewProduct.sizes && quickViewProduct.sizes.length > 0 && (
              <div className="pt-1">
                <span className="text-[11px] uppercase tracking-[0.15em] font-semibold text-[#0a0a0a] block mb-2">
                  Size:{' '}
                  <span className="font-normal text-zinc-500">
                    {selectedSize || quickViewProduct.sizes[0]}
                  </span>
                </span>
                <div className="flex flex-wrap gap-2">
                  {quickViewProduct.sizes.map(size => {
                    const isSelected = (selectedSize || quickViewProduct.sizes?.[0]) === size;
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`min-w-[42px] h-9 px-3 text-xs tracking-wider uppercase border rounded-none transition-colors cursor-pointer ${
                          isSelected
                            ? 'border-black bg-black text-white font-medium'
                            : 'border-zinc-300 bg-white text-[#0a0a0a] hover:border-black'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3 pt-6">
            <button
              type="button"
              onClick={handleAdd}
              disabled={added}
              className="w-full h-12 bg-black hover:bg-zinc-800 text-white text-[12px] uppercase tracking-[0.2em] font-semibold transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {added ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Added to Bag</span>
                </>
              ) : (
                <span>Add to Cart</span>
              )}
            </button>

            <div className="text-center pt-1">
              <Link
                to={`/collections/2026-new/products/${quickViewProduct.handle}`}
                onClick={() => setQuickViewProduct(null)}
                className="text-xs text-zinc-500 hover:text-black underline underline-offset-4 transition-colors"
              >
                View full details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
