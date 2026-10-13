// collection and catalog page

import React, { useState, useEffect, useMemo } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { dfineCollectionProducts } from '../components/common/collection-data';
import { fetchProducts } from '../api/productApi';
import { Product } from '../components/common/types';
import { useDfineStore } from '../context/store-context';
import { SlidersHorizontal } from 'lucide-react';

interface CollectionPageViewProps {
  title: string;
  subtitle?: string;
  initialProducts?: Product[];
  defaultGender?: 'ALL' | 'MEN' | 'WOMEN' | 'UNISEX';
  initialSaleOnly?: boolean;
  initialCategory?: string;
}

export function CollectionPageView({
  title = 'All T-Shirts',
  subtitle = 'Curated Drops & Silhouettes',
  initialProducts = dfineCollectionProducts,
  defaultGender = 'ALL',
  initialSaleOnly = false,
  initialCategory = 'All',
}: CollectionPageViewProps) {
  const { openQuickView } = useDfineStore();
  const [searchParams] = useSearchParams();

  // URL query param initializers
  const queryFit = searchParams.get('fit');
  const queryGsm = searchParams.get('gsm') ? Number(searchParams.get('gsm')) : null;
  const queryCategory = searchParams.get('category');

  const [selectedGender, setSelectedGender] = useState<'ALL' | 'MEN' | 'WOMEN' | 'UNISEX'>(defaultGender);
  const [selectedFit, setSelectedFit] = useState<string>(queryFit || 'All');
  const [selectedGsm, setSelectedGsm] = useState<number | 'All'>(queryGsm || 'All');
  const [selectedCategory, setSelectedCategory] = useState<string>(queryCategory || initialCategory);
  const [selectedSort, setSelectedSort] = useState<string>('featured');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [onlySale, setOnlySale] = useState(initialSaleOnly);

  // Sync when defaultGender or initialCategory changes (e.g. route switch)
  useEffect(() => {
    setSelectedGender(defaultGender);
    setOnlySale(initialSaleOnly);
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [defaultGender, initialSaleOnly, initialCategory]);

  const categories = [
    'All',
    'Spandex',
    'Terry',
    'Dye',
  ];

  const fits = ['All', 'Oversized', 'Relaxed'];
  const gsmOptions = ['All', 240, 260];
  const availableSizes = ['S', 'M', 'L', 'XL'];

  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    // Gender filter
    if (selectedGender !== 'ALL') {
      result = result.filter(
        p => p.gender === selectedGender || (selectedGender !== 'UNISEX' && p.gender === 'UNISEX')
      );
    }

    // Category / Style filter
    if (selectedCategory !== 'All') {
      result = result.filter(
        p => p.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Fit filter
    if (selectedFit !== 'All') {
      result = result.filter(
        p => p.fit?.toLowerCase() === selectedFit.toLowerCase()
      );
    }

    // GSM filter
    if (selectedGsm !== 'All') {
      result = result.filter(p => p.gsm === selectedGsm);
    }

    // Sale filter
    if (onlySale) {
      result = result.filter(
        p => p.badge?.toLowerCase().includes('sale') || (p.compareAtPrice && p.compareAtPrice > p.price)
      );
    }

    // Sizes filter
    if (selectedSizes.length > 0) {
      result = result.filter(p => (p.sizes ? selectedSizes.some(s => p.sizes?.includes(s)) : true));
    }

    // Sort order
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
  }, [
    initialProducts,
    selectedGender,
    selectedCategory,
    selectedFit,
    selectedGsm,
    selectedSort,
    selectedSizes,
    onlySale,
  ]);

  const toggleSize = (size: string) => {
    setSelectedSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const clearAllFilters = () => {
    setSelectedGender('ALL');
    setSelectedFit('All');
    setSelectedGsm('All');
    setSelectedCategory('All');
    setSelectedSizes([]);
    setOnlySale(false);
    setSelectedSort('featured');
  };

  return (
    <div className="w-full">
      {/* Promo Banner */}
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="bg-neutral-50 border border-zinc-200 p-8 md:p-10 text-center rounded-sm">
          <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-neutral-500 block mb-2">
            The Heavyweight Standard
          </span>
          <h2 className="font-sans text-2xl md:text-3xl font-semibold text-[#0a0a0a] mb-2">
            Engineered Combed Cotton T-Shirts
          </h2>
          <p className="text-xs md:text-sm text-neutral-600 max-w-xl mx-auto mb-5 leading-relaxed">
            Crafted in 180, 220, and 260 GSM textile weights with reinforced anti-sag collars and drop-shoulder streetwear silhouettes.
          </p>
          <div className="flex items-center justify-center gap-3">
            <a
              href="/#gsm-guide"
              className="inline-block bg-black hover:bg-neutral-800 text-white text-[11px] font-bold tracking-[0.15em] uppercase px-6 py-2.5 transition-colors cursor-pointer rounded-xs"
            >
              GSM Weight Guide
            </a>
            <button
              onClick={() => setOnlySale(true)}
              className="inline-block bg-white hover:bg-neutral-100 border border-zinc-300 text-black text-[11px] font-bold tracking-[0.15em] uppercase px-6 py-2.5 transition-colors cursor-pointer rounded-xs"
            >
              Sale Items Only
            </button>
          </div>
        </div>
      </div>

      {/* Collection Header & Breadcrumb */}
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-4">
        <nav className="text-[11px] tracking-wide text-neutral-500 mb-3 uppercase">
          <Link to="/" className="hover:text-black transition-colors">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-[#0a0a0a] font-medium">{title}</span>
        </nav>

        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-zinc-200 pb-6 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold text-[#0a0a0a]">{title}</h1>
            {subtitle && (
              <p className="text-xs text-neutral-500 tracking-wider uppercase mt-1">{subtitle}</p>
            )}
          </div>

          {/* Gender Filter Pills */}
          <div className="flex flex-wrap gap-2 pt-2 md:pt-0">
            {(['ALL', 'MEN', 'WOMEN', 'UNISEX'] as const).map(gender => (
              <button
                key={gender}
                onClick={() => setSelectedGender(gender)}
                className={`text-[12px] uppercase tracking-[0.1em] px-4 py-2 rounded-xs transition-colors cursor-pointer font-bold ${
                  selectedGender === gender
                    ? 'bg-black text-white shadow-xs'
                    : 'bg-neutral-100 text-[#0a0a0a] hover:bg-neutral-200'
                }`}
              >
                {gender === 'ALL' ? 'All Lines' : gender === 'MEN' ? "Men's" : gender === 'WOMEN' ? "Women's" : 'Unisex'}
              </button>
            ))}
          </div>
        </div>

        {/* Toolbar: Filter toggle, Count, Sort dropdown */}
        <div className="flex items-center justify-between py-4 text-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 px-3 py-2 border border-zinc-300 hover:border-black text-[#0a0a0a] uppercase tracking-[0.1em] text-[11px] font-bold transition-colors cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filter Facets</span>
              {(selectedSizes.length > 0 ||
                onlySale ||
                selectedFit !== 'All' ||
                selectedGsm !== 'All' ||
                selectedCategory !== 'All') && (
                <span className="w-2 h-2 rounded-full bg-black"></span>
              )}
            </button>
            <span className="text-neutral-500 hidden sm:inline-block">
              {filteredProducts.length} {filteredProducts.length === 1 ? 't-shirt' : 't-shirts'} found
            </span>
          </div>

          <div className="flex items-center gap-2">
            <label
              htmlFor="SortBy"
              className="text-[11px] uppercase tracking-wider text-neutral-500 hidden sm:inline-block"
            >
              Sort:
            </label>
            <select
              id="SortBy"
              value={selectedSort}
              onChange={e => setSelectedSort(e.target.value)}
              className="bg-white border border-zinc-300 text-[#0a0a0a] text-[11px] uppercase tracking-wider px-3 py-2 outline-none focus:border-black cursor-pointer"
            >
              <option value="featured">Featured Drops</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="title-asc">Alphabetically: A-Z</option>
              <option value="title-desc">Alphabetically: Z-A</option>
            </select>
          </div>
        </div>

        {/* Filter Drawer / Facet Panels */}
        {isFilterOpen && (
          <div className="p-6 mb-6 bg-neutral-50 border border-zinc-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-300">
            {/* 1. Fit Filter */}
            <div>
              <h4 className="text-[11px] uppercase tracking-[0.15em] font-bold text-[#0a0a0a] mb-2.5">
                Fit / Silhouette
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {fits.map(fit => (
                  <button
                    key={fit}
                    onClick={() => setSelectedFit(fit)}
                    className={`text-[11px] uppercase px-2.5 py-1 border transition-colors cursor-pointer ${
                      selectedFit === fit
                        ? 'border-black bg-black text-white font-medium'
                        : 'border-zinc-300 bg-white text-neutral-700 hover:border-black'
                    }`}
                  >
                    {fit}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. GSM Fabric Weight Filter */}
            <div>
              <h4 className="text-[11px] uppercase tracking-[0.15em] font-bold text-[#0a0a0a] mb-2.5">
                Fabric Weight (GSM)
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {gsmOptions.map(gsm => (
                  <button
                    key={String(gsm)}
                    onClick={() => setSelectedGsm(gsm as any)}
                    className={`text-[11px] uppercase px-2.5 py-1 border transition-colors cursor-pointer ${
                      selectedGsm === gsm
                        ? 'border-black bg-black text-white font-medium'
                        : 'border-zinc-300 bg-white text-neutral-700 hover:border-black'
                    }`}
                  >
                    {gsm === 'All' ? 'All GSM' : `${gsm} GSM`}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Style Category */}
            <div>
              <h4 className="text-[11px] uppercase tracking-[0.15em] font-bold text-[#0a0a0a] mb-2.5">
                Style Category
              </h4>
              <div className="flex flex-col gap-1 text-[12px]">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-left transition-colors cursor-pointer ${
                      selectedCategory === cat ? 'font-bold text-black underline' : 'text-neutral-600 hover:text-black'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Sizing & Reset */}
            <div>
              <h4 className="text-[11px] uppercase tracking-[0.15em] font-bold text-[#0a0a0a] mb-2.5">
                Sizes & Promo
              </h4>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {availableSizes.map(size => {
                  const isChecked = selectedSizes.includes(size);
                  return (
                    <button
                      key={size}
                      onClick={() => toggleSize(size)}
                      className={`w-8 h-8 text-[11px] flex items-center justify-center border transition-colors cursor-pointer ${
                        isChecked
                          ? 'border-black bg-black text-white font-bold'
                          : 'border-zinc-300 bg-white text-[#0a0a0a] hover:border-black'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-xs text-[#0a0a0a] mb-3">
                <input
                  type="checkbox"
                  checked={onlySale}
                  onChange={e => setOnlySale(e.target.checked)}
                  className="rounded-none border-zinc-300 text-black focus:ring-0"
                />
                <span>Sale Clearance Only</span>
              </label>

              <button
                onClick={clearAllFilters}
                className="text-[11px] uppercase tracking-wider text-rose-600 hover:underline font-bold cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Product Grid: 4-columns */}
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center text-neutral-500">
            <p className="text-base font-medium text-neutral-800">No t-shirts found matching your filters.</p>
            <p className="text-xs text-neutral-500 mt-1">Try resetting your GSM, Fit, or Gender criteria.</p>
            <button
              onClick={clearAllFilters}
              className="mt-4 text-xs uppercase tracking-wider text-[#0a0a0a] underline font-bold cursor-pointer"
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
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-100 border border-zinc-100">
                    {product.badge && (
                      <span
                        className={`absolute top-0 right-0 z-10 text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 ${
                          product.badge.toLowerCase().includes('sale')
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
                          hasHover
                            ? 'group-hover:opacity-0'
                            : 'group-hover:opacity-90'
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
                      className="absolute bottom-[10px] left-[10px] right-[10px] w-[calc(100%-20px)] z-20 bg-black hover:bg-neutral-800 text-white text-[12px] font-bold tracking-[0.35px] py-2 px-1 text-center opacity-0 translate-y-[5px] group-hover:opacity-100 group-hover:translate-y-0 transition-[opacity,transform,background-color] duration-200 ease-out cursor-pointer"
                    >
                      Quick View
                    </button>
                  </div>

                  {/* Product Info */}
                  <div className="pt-3 pb-1 flex flex-col flex-1">
                    {(product.gsm || product.gender) && (
                      <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-0.5">
                        {product.gsm ? `${product.gsm} GSM` : ''}
                        {product.gsm && product.gender ? ' • ' : ''}
                        {product.gender || ''}
                      </div>
                    )}

                    <Link
                      to={`/products/${product.handle}`}
                      className="text-sm text-[#0a0a0a] hover:underline font-medium transition-colors line-clamp-1"
                    >
                      {product.title}
                    </Link>

                    <div className="mt-1 flex items-center gap-2 text-xs">
                      {hasDiscount ? (
                        <>
                          <span className="text-black font-semibold font-mono">
                            LKR {Number(product.price).toLocaleString()}
                          </span>
                          <span className="text-neutral-400 line-through font-mono">
                            LKR {Number(product.compareAtPrice).toLocaleString()}
                          </span>
                        </>
                      ) : (
                        <span className="text-neutral-900 font-semibold font-mono">
                          LKR {Number(product.price).toLocaleString()}
                        </span>
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

  let defaultGender: 'ALL' | 'MEN' | 'WOMEN' | 'UNISEX' = 'ALL';
  let initialSaleOnly = false;
  let initialCategory = 'All';
  let title = 'All T-Shirts';
  let subtitle = 'Spandex • French Terry • Garment Dye';

  if (handle === 'spandex') {
    initialCategory = 'Spandex';
    title = 'Spandex Series';
    subtitle = 'Heavyweight Stretch & Precision Streetwear Drape';
  } else if (handle === 'terry') {
    initialCategory = 'Terry';
    title = 'French Terry Series';
    subtitle = 'Micro-Loop Knitted Premium Streetwear Drops';
  } else if (handle === 'dye') {
    initialCategory = 'Dye';
    title = 'Garment Dye Series';
    subtitle = 'Authentic Pigment-Dyed Vintage Character';
  } else if (handle === 'men') {
    defaultGender = 'MEN';
    title = "Men's Streetwear";
    subtitle = 'Precision Cuts & Heavyweight Silhouettes';
  } else if (handle === 'women') {
    defaultGender = 'WOMEN';
    title = "Women's Streetwear";
    subtitle = 'Curated Cuts & Silhouettes';
  } else if (handle === 'unisex') {
    defaultGender = 'UNISEX';
    title = 'Unisex Streetwear';
    subtitle = 'Spandex & French Terry Series';
  } else if (handle === 'sale') {
    initialSaleOnly = true;
    title = 'Sale Clearance';
    subtitle = 'Limited Streetwear Drops';
  } else if (handle) {
    title = handle
      .split('-')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }

  return (
    <CollectionPageView
      title={title}
      subtitle={subtitle}
      initialProducts={products}
      defaultGender={defaultGender}
      initialSaleOnly={initialSaleOnly}
      initialCategory={initialCategory}
    />
  );
}
