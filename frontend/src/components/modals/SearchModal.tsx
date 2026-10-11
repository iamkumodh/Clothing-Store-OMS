/**
 * Storefront Product Predictive Search Modal
 * Dual-Mode: Fast predictive typing + Instant navigation to /search?q=...
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDfineStore } from '../../context/store-context';
import { fetchProducts } from '../../api/productApi';
import { dfineProducts } from '../common/data';
import { Product } from '../common/types';
import { CloseIcon, SearchIcon } from '../common/icons';
import { ArrowRight, CornerDownLeft } from 'lucide-react';

const SUGGESTED_SEARCHES = ['Linen', 'Ceru Knit', 'Wren Coat', 'Trouser', 'Blazer', 'Tee'];

export function SearchModal() {
  const { isSearchOpen, setIsSearchOpen, addToCart } = useDfineStore();
  const [query, setQuery] = useState('');
  const [catalogProducts, setCatalogProducts] = useState<Product[]>(dfineProducts);
  const navigate = useNavigate();

  // Load products from live API / fallback store on mount
  useEffect(() => {
    let isMounted = true;
    fetchProducts().then(live => {
      if (isMounted && live && live.length > 0) {
        setCatalogProducts(live);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Reset query on close
  useEffect(() => {
    if (!isSearchOpen) {
      setQuery('');
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const trimmedQuery = query.trim().toLowerCase();

  const results = trimmedQuery
    ? catalogProducts.filter(
        p =>
          p.title.toLowerCase().includes(trimmedQuery) ||
          p.category?.toLowerCase().includes(trimmedQuery) ||
          p.description?.toLowerCase().includes(trimmedQuery) ||
          p.material?.toLowerCase().includes(trimmedQuery)
      )
    : [];

  const handleNavigateToSearch = (searchTerm?: string) => {
    const target = (searchTerm !== undefined ? searchTerm : query).trim();
    setIsSearchOpen(false);
    if (target) {
      navigate(`/search?q=${encodeURIComponent(target)}`);
    } else {
      navigate('/search');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleNavigateToSearch();
    } else if (e.key === 'Escape') {
      setIsSearchOpen(false);
    }
  };

  const handleProductClick = (handle: string) => {
    setIsSearchOpen(false);
    navigate(`/products/${handle}`);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center pt-16 sm:pt-20 px-4 animate-in fade-in duration-200"
      onClick={e => {
        if (e.target === e.currentTarget) setIsSearchOpen(false);
      }}
    >
      <div className="bg-white text-[#0a0a0a] w-full max-w-2xl rounded-[2px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-zinc-200 flex flex-col max-h-[85vh]">
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-zinc-200 flex items-center gap-3">
          <SearchIcon className="w-5 h-5 text-zinc-400 shrink-0" />
          <input
            type="text"
            placeholder="Search garments, coats, linen, knitwear..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            className="flex-1 text-sm sm:text-base tracking-wide placeholder:text-zinc-400 focus:outline-none"
          />

          {query && (
            <button
              type="button"
              onClick={() => handleNavigateToSearch()}
              className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-zinc-500 hover:text-black uppercase tracking-wider bg-zinc-100 hover:bg-zinc-200 px-2 py-1 transition-colors cursor-pointer"
              title="Press Enter to view full results"
            >
              <span>Enter</span>
              <CornerDownLeft className="w-3 h-3" />
            </button>
          )}

          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1 text-zinc-400 hover:text-black cursor-pointer transition-colors"
            aria-label="Close search"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-4 sm:p-6 flex-1">
          {query.trim() === '' ? (
            <div>
              <p className="text-[11px] font-bold tracking-widest uppercase text-zinc-500 mb-3">
                Suggested Searches
              </p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_SEARCHES.map(term => (
                  <button
                    key={term}
                    onClick={() => handleNavigateToSearch(term)}
                    className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-[12px] font-medium tracking-wide rounded-[2px] text-[#0a0a0a] transition-colors cursor-pointer"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-10 text-zinc-500 space-y-3">
              <p className="text-sm">No results found for &ldquo;{query}&rdquo;.</p>
              <button
                type="button"
                onClick={() => handleNavigateToSearch()}
                className="text-xs font-semibold text-[#0a0a0a] uppercase tracking-wider underline cursor-pointer"
              >
                Go to Dedicated Search Catalog &rarr;
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between pb-2 mb-1 border-b border-zinc-100 text-[11px] uppercase tracking-wider text-zinc-500 font-semibold">
                <span>Quick Matches</span>
                <span>{results.length} found</span>
              </div>

              {results.slice(0, 5).map(product => (
                <div
                  key={product.id}
                  className="flex items-center gap-3.5 p-2 rounded hover:bg-zinc-50 transition-colors group"
                >
                  {/* Thumbnail */}
                  <div
                    onClick={() => handleProductClick(product.handle)}
                    className="relative w-12 h-16 bg-zinc-100 rounded-[2px] overflow-hidden shrink-0 border border-zinc-200 cursor-pointer"
                  >
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>

                  {/* Info */}
                  <div
                    onClick={() => handleProductClick(product.handle)}
                    className="flex-1 min-w-0 cursor-pointer"
                  >
                    <h4 className="text-[13px] font-medium text-[#0a0a0a] truncate group-hover:underline">
                      {product.title}
                    </h4>
                    <p className="text-[11px] text-zinc-500 mt-0.5">
                      {product.category || 'Tops'} &bull;{' '}
                      <span className="font-mono text-zinc-700">
                        LKR {Number(product.price).toLocaleString()}
                      </span>
                    </p>
                  </div>

                  {/* Quick Add Action */}
                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      addToCart(product, 1);
                      setIsSearchOpen(false);
                    }}
                    className="px-2.5 py-1 bg-black hover:bg-zinc-800 text-white text-[10px] font-semibold tracking-wider uppercase rounded-[2px] transition-colors cursor-pointer shrink-0"
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer: Dedicated Search Page Direct Action */}
        {query.trim() && (
          <div className="p-3.5 sm:p-4 bg-zinc-50 border-t border-zinc-200 flex items-center justify-between">
            <span className="text-xs text-zinc-500 truncate mr-2">
              Looking for broader filters and all matching styles?
            </span>
            <button
              type="button"
              onClick={() => handleNavigateToSearch()}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-black hover:bg-zinc-800 text-white text-xs font-semibold tracking-wider uppercase transition-colors shrink-0 cursor-pointer shadow-sm"
            >
              <span>View all {results.length} results</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
