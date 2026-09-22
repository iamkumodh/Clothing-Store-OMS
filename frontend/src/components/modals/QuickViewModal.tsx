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
      <div className="relative bg-white text-[#2a3743] max-w-4xl w-full shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 rounded-none max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={() => {
            setQuickViewProduct(null);
            setSelectedImageIndex(0);
          }}
          className="absolute top-4 right-4 z-20 p-2 text-[#2a3743] hover:text-black transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Gallery / Image Column */}
        <div className="md:col-span-6 bg-[#f7f5f2] p-6 flex flex-col justify-center items-center">
          <div className="relative aspect-[3/4] w-full max-w-md bg-[#edebe7] overflow-hidden">
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
                  className={`relative w-14 h-18 shrink-0 border transition-all ${
                    selectedImageIndex === i
                      ? 'border-[#2a3743] ring-1 ring-[#2a3743]'
                      : 'border-transparent opacity-70 hover:opacity-100'
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
              <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#6e7278]">
                {quickViewProduct.category}
              </span>
            )}

            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#2a3743] tracking-tight">
              {quickViewProduct.title}
            </h2>

            <div className="flex items-center gap-2">
              <span className="text-xl font-normal text-[#2a3743]">${quickViewProduct.price}</span>
              {quickViewProduct.compareAtPrice &&
                quickViewProduct.compareAtPrice > quickViewProduct.price && (
                  <span className="text-sm text-[#888] line-through">
                    ${quickViewProduct.compareAtPrice}
                  </span>
                )}
              <span className="text-[11px] uppercase tracking-wider text-[#6e7278]">USD</span>
            </div>

            <p className="text-xs sm:text-sm text-[#4a5568] leading-relaxed border-t border-b border-[#e5e5e5] py-3">
              {quickViewProduct.description ||
                'Designed with clean, relaxed tailoring in breathable natural textiles for everyday rotation.'}
            </p>

            {/* Size Options */}
            {quickViewProduct.sizes && quickViewProduct.sizes.length > 0 && (
              <div className="pt-1">
                <span className="text-[11px] uppercase tracking-[0.15em] font-semibold text-[#2a3743] block mb-2">
                  Size:{' '}
                  <span className="font-normal text-[#6e7278]">
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
                        className={`min-w-[42px] h-9 px-3 text-xs tracking-wider uppercase border rounded-none transition-colors ${
                          isSelected
                            ? 'border-[#2a3743] bg-[#2a3743] text-white font-medium'
                            : 'border-[#d6d6d6] bg-white text-[#2a3743] hover:border-[#2a3743]'
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
              className="w-full h-12 bg-[#2a3743] hover:bg-black text-white text-[12px] uppercase tracking-[0.2em] font-semibold transition-colors duration-200 flex items-center justify-center gap-2"
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
                className="text-xs text-[#6e7278] hover:text-[#2a3743] underline underline-offset-4 transition-colors"
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
