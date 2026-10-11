// search page

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { fetchProducts } from '../api/productApi';
import { dfineCollectionProducts } from '../components/common/collection-data';
import { Product } from '../components/common/types';
import { useDfineStore } from '../context/store-context';
import { SearchIcon, CloseIcon } from '../components/common/icons';
import { SlidersHorizontal, ArrowRight } from 'lucide-react';

const SUGGESTED_SEARCHES = ['Knit', 'Linen', 'Blazer', 'Coat', 'Trouser', 'Overshirt', 'Tee'];
const CATEGORIES = ['All', 'Tops', 'Bottoms', 'Dresses', 'Layers', 'Sets'];

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const rawQuery = searchParams.get('q') || '';
  const [inputValue, setInputValue] = useState(rawQuery);
  const [products, setProducts] = useState<Product[]>(dfineCollectionProducts);
  const [isLoading, setIsLoading] = useState(true);

  // Filters & Sorting
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [onlySale, setOnlySale] = useState(false);
  const [selectedSort, setSelectedSort] = useState<string>('featured');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { openQuickView } = useDfineStore();

  // Keep input value in sync when query parameter changes
  useEffect(() => {
    setInputValue(rawQuery);
  }, [rawQuery]);

  // Load products from live backend / reactive fallback store
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    fetchProducts()
      .then(liveProducts => {
        if (isMounted && liveProducts && liveProducts.length > 0) {
          setProducts(liveProducts);
        }
      })
      .catch(() => {
        // Fallback already assigned in initial state
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (trimmed) {
      setSearchParams({ q: trimmed });
    } else {
      setSearchParams({});
    }
  };

  const handleClearSearch = () => {
    setInputValue('');
    setSearchParams({});
  };

  const handleChipClick = (term: string) => {
    setInputValue(term);
    setSearchParams({ q: term });
  };

  // Filter & Search Logic
  const filteredProducts = useMemo(() => {
    const q = rawQuery.trim().toLowerCase();

    let result = products;

    if (q) {
      result = result.filter(p => {
        const titleMatch = p.title.toLowerCase().includes(q);
        const categoryMatch = p.category?.toLowerCase().includes(q);
        const descMatch = p.description?.toLowerCase().includes(q);
        const materialMatch = p.material?.toLowerCase().includes(q);
        return titleMatch || categoryMatch || descMatch || materialMatch;
      });
    }

    if (selectedCategory !== 'All') {
      result = result.filter(
        p => p.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (onlySale) {
      result = result.filter(
        p => p.badge === 'Sale' || (p.compareAtPrice && p.compareAtPrice > p.price)
      );
    }

    if (selectedSort === 'price-asc') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (selectedSort === 'price-desc') {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (selectedSort === 'title-asc') {
      result = [...result].sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [products, rawQuery, selectedCategory, onlySale, selectedSort]);

  // Curated fallback essentials for zero-state
  const fallbackRecommendations = useMemo(() => {
    return products.slice(0, 4);
  }, [products]);

  return (
    <div className="w-full min-h-[70vh] bg-white">
      {/* Search Header Banner */}
      <section className="bg-zinc-50 border-b border-zinc-200 py-10 sm:py-14">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-zinc-500 block">
              D&apos;fine Storefront Search
            </span>

            <h1 className="font-serif text-3xl sm:text-4xl text-[#0a0a0a] font-normal tracking-tight">
              {rawQuery.trim() ? (
                <>
                  Results for &ldquo;<span className="font-medium">{rawQuery}</span>&rdquo;
                </>
              ) : (
                'Search Our Garment Catalog'
              )}
            </h1>

            {/* In-page Search Bar */}
            <form onSubmit={handleSearchSubmit} className="relative mt-6 max-w-xl mx-auto">
              <div className="relative flex items-center border border-zinc-300 focus-within:border-black bg-white transition-colors">
                <SearchIcon className="w-5 h-5 text-zinc-400 ml-4 shrink-0" />
                <input
                  type="text"
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  placeholder="Search coats, linen shirts, trousers, knitwear..."
                  className="w-full py-3.5 px-3 text-sm text-[#0a0a0a] placeholder:text-zinc-400 focus:outline-none"
                />
                {inputValue && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="p-2 text-zinc-400 hover:text-black cursor-pointer"
                    aria-label="Clear input"
                  >
                    <CloseIcon className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="submit"
                  className="px-5 py-3.5 bg-black hover:bg-zinc-800 text-white text-xs font-semibold uppercase tracking-wider transition-colors shrink-0 cursor-pointer"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Popular Suggestion Chips */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-1.5 text-xs">
              <span className="text-zinc-500 font-medium text-[11px] uppercase tracking-wider mr-1">
                Popular:
              </span>
              {SUGGESTED_SEARCHES.map(term => (
                <button
                  key={term}
                  type="button"
                  onClick={() => handleChipClick(term)}
                  className={`px-2.5 py-1 text-[11px] uppercase tracking-wide border transition-colors cursor-pointer ${
                    rawQuery.toLowerCase() === term.toLowerCase()
                      ? 'bg-black text-white border-black font-semibold'
                      : 'bg-white text-zinc-600 border-zinc-200 hover:border-black hover:text-black'
                  }`}
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Filter, Sort & Counter Bar */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 border-b border-zinc-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Left: Category pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs uppercase tracking-wider whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-black text-white font-semibold'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Right: Sort & Filter toggles */}
          <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
            <span className="text-xs text-zinc-500 font-mono">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'style' : 'styles'}
            </span>

            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#0a0a0a] border border-zinc-200 hover:border-black px-3 py-1.5 transition-colors cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{isFilterOpen ? 'Hide Filters' : 'Filters'}</span>
            </button>

            <select
              value={selectedSort}
              onChange={e => setSelectedSort(e.target.value)}
              className="text-xs border border-zinc-200 py-1.5 px-3 bg-white text-[#0a0a0a] font-medium tracking-wide focus:outline-none focus:border-black cursor-pointer"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="title-asc">Alphabetical: A–Z</option>
            </select>
          </div>
        </div>

        {/* Collapsible Filter Drawer */}
        {isFilterOpen && (
          <div className="pt-4 mt-4 border-t border-zinc-200 flex flex-wrap items-center justify-between gap-4 animate-in fade-in duration-200">
            <label className="flex items-center gap-2 text-xs font-medium text-[#0a0a0a] cursor-pointer">
              <input
                type="checkbox"
                checked={onlySale}
                onChange={e => setOnlySale(e.target.checked)}
                className="w-4 h-4 rounded-none border-zinc-300 text-black focus:ring-0 cursor-pointer"
              />
              <span>Sale &amp; Promotional Items Only</span>
            </label>

            {(selectedCategory !== 'All' || onlySale || selectedSort !== 'featured') && (
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setOnlySale(false);
                  setSelectedSort('featured');
                }}
                className="text-[11px] uppercase tracking-wider text-zinc-500 hover:text-black underline cursor-pointer"
              >
                Reset active filters
              </button>
            )}
          </div>
        )}
      </section>

      {/* Main Results Grid */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {isLoading ? (
          <div className="py-24 text-center">
            <div className="inline-block w-8 h-8 border-2 border-zinc-300 border-t-black rounded-full animate-spin mb-4" />
            <p className="text-xs uppercase tracking-widest text-zinc-500">Searching catalog...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          /* Empty / Zero-state */
          <div className="py-12 space-y-12">
            <div className="max-w-lg mx-auto text-center space-y-3">
              <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400">
                <SearchIcon className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-serif text-[#0a0a0a] font-normal">
                No matching garments found
              </h2>
              <p className="text-xs text-zinc-500 leading-relaxed">
                We couldn&apos;t find any items matching &ldquo;{rawQuery}&rdquo;. Try checking for typos,
                using broader search terms, or explore our capsule collections below.
              </p>
              <div className="pt-2 flex justify-center gap-3">
                <Link
                  to="/collections/2026-new"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-black hover:bg-zinc-800 text-white text-xs font-semibold tracking-wider uppercase transition-colors"
                >
                  <span>Explore New Arrivals</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Helpful Alternative Suggestions */}
            <div className="pt-8 border-t border-zinc-200">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <span className="text-[11px] uppercase tracking-widest text-zinc-500 font-semibold block">
                    Curated Capsule
                  </span>
                  <h3 className="font-serif text-xl font-normal text-[#0a0a0a]">
                    Featured Everyday Essentials
                  </h3>
                </div>
                <Link
                  to="/collections/2026-new"
                  className="text-xs uppercase tracking-wider font-semibold text-[#0a0a0a] hover:underline"
                >
                  View All &rarr;
                </Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                {fallbackRecommendations.map(product => (
                  <ProductSearchCard key={product.id} product={product} openQuickView={openQuickView} />
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Responsive Product Grid */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6">
            {filteredProducts.map(product => (
              <ProductSearchCard key={product.id} product={product} openQuickView={openQuickView} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

interface ProductSearchCardProps {
  product: Product;
  openQuickView: (product: Product) => void;
}

function ProductSearchCard({ product, openQuickView }: ProductSearchCardProps) {
  const hasHover = !!product.hoverImage;
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;

  return (
    <div className="group relative flex flex-col">
      {/* Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-100 border border-zinc-100">
        {product.badge && (
          <span
            className={`absolute top-0 right-0 z-10 text-[11px] uppercase font-semibold tracking-wider px-2.5 py-1 ${
              product.badge === 'Sale'
                ? 'bg-black text-white'
                : 'bg-white/95 text-black border-b border-l border-zinc-200 backdrop-blur-xs'
            }`}
          >
            {product.badge}
          </span>
        )}

        <Link
          to={`/products/${product.handle}`}
          className="block w-full h-full relative"
        >
          <img
            src={product.image}
            alt={product.title}
            className={`w-full h-full object-cover transition-opacity duration-500 ${
              hasHover ? 'group-hover:opacity-0' : 'group-hover:opacity-90'
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

        {/* Quick View Button */}
        <button
          type="button"
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            openQuickView(product);
          }}
          className="absolute bottom-[10px] left-[10px] right-[10px] w-[calc(100%-20px)] z-20 bg-black hover:bg-zinc-800 text-white text-[13px] font-medium tracking-[0.35px] py-2 px-1 text-center opacity-0 translate-y-[5px] group-hover:opacity-100 group-hover:translate-y-0 transition-[opacity,transform,background-color] duration-200 ease-out cursor-pointer rounded-none shadow-sm"
        >
          Quick View
        </button>
      </div>

      {/* Product Information */}
      <div className="pt-3 pb-1 flex flex-col flex-1">
        <Link
          to={`/products/${product.handle}`}
          className="text-sm text-[#0a0a0a] hover:text-black font-normal transition-colors line-clamp-1"
        >
          {product.title}
        </Link>

        <div className="mt-1 flex items-center gap-2 text-xs">
          {hasDiscount ? (
            <>
              <span className="text-black font-semibold">
                LKR {Number(product.price).toLocaleString()}
              </span>
              <span className="text-zinc-500 line-through">
                LKR {Number(product.compareAtPrice).toLocaleString()}
              </span>
              <span className="text-[10px] text-zinc-500 uppercase font-semibold">
                Save LKR {(product.compareAtPrice! - product.price).toLocaleString()}
              </span>
            </>
          ) : (
            <span className="text-zinc-600 font-mono">
              LKR {Number(product.price).toLocaleString()}
            </span>
          )}
        </div>

        {/* Color Indicators */}
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
}
