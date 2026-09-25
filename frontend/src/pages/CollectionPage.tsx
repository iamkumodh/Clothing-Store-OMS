/**
 * Product Catalog & Collection Filtering Page
 */
import React, { useState, useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { dfineCollectionProducts } from '../components/common/collection-data';
import { fetchProducts } from '../api/productApi';
import { Product } from '../components/common/types';
import { useDfineStore } from '../context/store-context';
import { SlidersHorizontal } from 'lucide-react';

interface CollectionPageViewProps {
  title: string;
  subtitle?: string;
  initialProducts?: Product[];
}

export function CollectionPageView({
  title = '2026 - All New',
  subtitle = 'Curated Capsule',
  initialProducts = dfineCollectionProducts,
}: CollectionPageViewProps) {
  const { openQuickView } = useDfineStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSort, setSelectedSort] = useState<string>('featured');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [onlySale, setOnlySale] = useState(false);

  const categories = ['All', 'Tops', 'Bottoms', 'Dresses', 'Layers', 'Sets'];
  const availableSizes = ['XS', 'S', 'M', 'L', 'XL'];

  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    if (onlySale) {
      result = result.filter(
        p => p.badge === 'Sale' || (p.compareAtPrice && p.compareAtPrice > p.price)
      );
    }

    if (selectedSizes.length > 0) {
      result = result.filter(p => (p.sizes ? selectedSizes.some(s => p.sizes?.includes(s)) : true));
    }

    if (selectedSort === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (selectedSort === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (selectedSort === 'title-asc') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (selectedSort === 'title-desc') {
      result.sort((a, b) => b.title.localeCompare(a.title));
    }

    return result;
  }, [initialProducts, selectedCategory, selectedSort, selectedSizes, onlySale]);

  const toggleSize = (size: string) => {
    setSelectedSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const clearAllFilters = () => {
    setSelectedCategory('All');
    setSelectedSizes([]);
    setOnlySale(false);
    setSelectedSort('featured');
  };

  return (
    <div className="w-full">
      {/* Promo Banner */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="bg-[#edebe7] p-8 md:p-12 text-center rounded-none">
          <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#6e7278] block mb-2">
            Limited Time Offer
          </span>
          <h2 className="font-serif text-2xl md:text-4xl font-normal text-[#2a3743] mb-3">
            Save on Select Styles
          </h2>
          <p className="text-xs md:text-sm text-[#4a5568] max-w-lg mx-auto mb-6">
            Take an extra 10% off sale items — limited time only on our 2026 new arrivals
            collection.
          </p>
          <button
            onClick={() => setOnlySale(true)}
            className="inline-block bg-[#2a3743] hover:bg-black text-white text-[11px] font-semibold tracking-[0.2em] uppercase px-8 py-3.5 transition-colors"
          >
            SHOP SALE
          </button>
        </div>
      </div>

      {/* Collection Title & Breadcrumb Header */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-4">
        <nav className="text-[11px] tracking-wide text-[#6e7278] mb-3 uppercase">
          <Link to="/" className="hover:text-[#2a3743] transition-colors">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-[#2a3743] font-medium">{title}</span>
        </nav>
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#e5e5e5] pb-6 gap-4">
          <div>
            <h1 className="font-serif text-3xl md:text-4xl font-normal text-[#2a3743]">{title}</h1>
            {subtitle && (
              <p className="text-xs text-[#6e7278] tracking-widest uppercase mt-1">{subtitle}</p>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 pt-2 md:pt-0">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-[12px] uppercase tracking-[0.1em] px-3.5 py-1.5 transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[#2a3743] text-white font-medium'
                    : 'bg-[#f5f5f5] text-[#2a3743] hover:bg-[#e8e8e8]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Toolbar: Filter toggle, Count, Sort dropdown */}
        <div className="flex items-center justify-between py-4 text-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 px-3 py-2 border border-[#d6d6d6] hover:border-[#2a3743] text-[#2a3743] uppercase tracking-[0.1em] text-[11px] font-medium transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filter</span>
              {(selectedSizes.length > 0 || onlySale || selectedCategory !== 'All') && (
                <span className="w-2 h-2 rounded-full bg-[#2a3743]"></span>
              )}
            </button>
            <span className="text-[#6e7278] hidden sm:inline-block">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <label
              htmlFor="SortBy"
              className="text-[11px] uppercase tracking-wider text-[#6e7278] hidden sm:inline-block"
            >
              Sort:
            </label>
            <select
              id="SortBy"
              value={selectedSort}
              onChange={e => setSelectedSort(e.target.value)}
              className="bg-white border border-[#d6d6d6] text-[#2a3743] text-[11px] uppercase tracking-wider px-3 py-2 outline-none focus:border-[#2a3743] cursor-pointer"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price, low to high</option>
              <option value="price-desc">Price, high to low</option>
              <option value="title-asc">Alphabetically, A-Z</option>
              <option value="title-desc">Alphabetically, Z-A</option>
            </select>
          </div>
        </div>

        {/* Filter Drawer / Accordion Section */}
        {isFilterOpen && (
          <div className="p-5 mb-6 bg-[#fafafa] border border-[#e5e5e5] grid grid-cols-1 sm:grid-cols-3 gap-6 transition-all duration-300">
            <div>
              <h4 className="text-[11px] uppercase tracking-[0.15em] font-semibold text-[#2a3743] mb-3">
                Size
              </h4>
              <div className="flex flex-wrap gap-2">
                {availableSizes.map(size => {
                  const isChecked = selectedSizes.includes(size);
                  return (
                    <button
                      key={size}
                      onClick={() => toggleSize(size)}
                      className={`w-9 h-9 text-xs flex items-center justify-center border transition-colors ${
                        isChecked
                          ? 'border-[#2a3743] bg-[#2a3743] text-white'
                          : 'border-[#d6d6d6] bg-white text-[#2a3743] hover:border-black'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <h4 className="text-[11px] uppercase tracking-[0.15em] font-semibold text-[#2a3743] mb-3">
                Promotions
              </h4>
              <label className="flex items-center gap-2 cursor-pointer text-xs text-[#2a3743]">
                <input
                  type="checkbox"
                  checked={onlySale}
                  onChange={e => setOnlySale(e.target.checked)}
                  className="rounded-none border-[#ccc] text-[#2a3743] focus:ring-0"
                />
                <span>Sale Items Only</span>
              </label>
            </div>

            <div className="flex flex-col justify-between items-start sm:items-end">
              <span className="text-xs text-[#6e7278]">
                Showing {filteredProducts.length} of {initialProducts.length} styles
              </span>
              <button
                onClick={clearAllFilters}
                className="text-[11px] uppercase tracking-wider text-[#2a3743] hover:underline mt-4 sm:mt-0 font-medium"
              >
                Clear all filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Product Grid: 4-columns */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center text-[#6e7278]">
            <p className="text-sm">No products found matching your filters.</p>
            <button
              onClick={clearAllFilters}
              className="mt-4 text-xs uppercase tracking-wider text-[#2a3743] underline font-medium"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6">
            {filteredProducts.map(product => {
              const hasHover = !!product.hoverImage;
              const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;

              return (
                <div key={product.id} className="group relative flex flex-col">
                  {/* Image Container */}
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#f4f2ee]">
                    {product.badge && (
                      <span
                        className={`absolute top-0 right-0 z-10 text-[13px] font-normal tracking-[0.4px] px-2.5 py-1 ${
                          product.badge === 'Sale'
                            ? 'bg-[#fddaca] text-[#2a3743]'
                            : 'bg-[#edebe7] text-[#2a3743]'
                        }`}
                      >
                        {product.badge}
                      </span>
                    )}

                    <Link
                      to={`/collections/2026-new/products/${product.handle}`}
                      className="block w-full h-full relative"
                    >
                      <img
                        src={product.image}
                        alt={product.title}
                        className={`w-full h-full object-cover transition-opacity duration-500 ${
                          hasHover
                            ? 'group-hover:opacity-0'
                            : 'group-hover:scale-105 transition-transform duration-700'
                        }`}
                        loading="lazy"
                      />
                      {hasHover && (
                        <img
                          src={product.hoverImage!}
                          alt={`${product.title} - hover`}
                          className="w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                          loading="lazy"
                        />
                      )}
                    </Link>

                    {/* Quick View Button (Exact 1:1 D'fine Theme) */}
                    <button
                      type="button"
                      onClick={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        openQuickView(product);
                      }}
                      className="absolute bottom-[10px] left-[10px] right-[10px] w-[calc(100%-20px)] z-20 bg-[#2a3743] hover:bg-black text-white text-[14px] font-normal tracking-[0.35px] py-2 px-1 text-center opacity-0 translate-y-[5px] group-hover:opacity-100 group-hover:translate-y-0 transition-[opacity,transform,background-color] duration-250 ease-out cursor-pointer rounded-none"
                    >
                      Quick View
                    </button>
                  </div>

                  {/* Product Info */}
                  <div className="pt-3 pb-1 flex flex-col flex-1">
                    <Link
                      to={`/collections/2026-new/products/${product.handle}`}
                      className="text-sm text-[#2a3743] hover:text-[#000] font-normal transition-colors line-clamp-1"
                    >
                      {product.title}
                    </Link>

                    <div className="mt-1 flex items-center gap-2 text-xs">
                      {hasDiscount ? (
                        <>
                          <span className="text-[#a83232] font-medium">${product.price}</span>
                          <span className="text-[#888] line-through">
                            ${product.compareAtPrice}
                          </span>
                          <span className="text-[10px] text-[#a83232] uppercase font-semibold">
                            Save ${(product.compareAtPrice! - product.price).toFixed(0)}
                          </span>
                        </>
                      ) : (
                        <span className="text-[#4a5568]">${product.price}</span>
                      )}
                    </div>

                    {/* Color indicators */}
                    {product.colors && product.colors.length > 1 && (
                      <div className="mt-2 flex items-center gap-1">
                        {product.colors.map((c, i) => (
                          <span
                            key={i}
                            className="w-2.5 h-2.5 rounded-full border border-black/20"
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function CollectionPage() {
  const { handle } = useParams<{ handle: string }>();
  const [products, setProducts] = useState<Product[]>(dfineCollectionProducts);

  useEffect(() => {
    fetchProducts().then(liveProducts => {
      if (liveProducts && liveProducts.length > 0) {
        setProducts(liveProducts);
      }
    });
  }, [handle]);

  const title = handle
    ? handle
        .split('-')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ')
    : '2026 - All New';

  return <CollectionPageView title={title} initialProducts={products} />;
}
