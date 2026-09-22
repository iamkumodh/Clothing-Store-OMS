/**
 * Storefront Product Search Modal
 */
import React, { useState } from 'react';
import { useDfineStore } from '../../context/store-context';
import { dfineProducts } from '../common/data';
import { CloseIcon, SearchIcon } from '../common/icons';

export function SearchModal() {
  const { isSearchOpen, setIsSearchOpen, addToCart } = useDfineStore();
  const [query, setQuery] = useState('');

  if (!isSearchOpen) return null;

  const results = query.trim()
    ? dfineProducts.filter(
        p =>
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-start justify-center pt-20 px-4 animate-in fade-in">
      <div className="bg-white text-[#2a3743] w-full max-w-2xl rounded-[2px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-5 border-b border-[#e8e6e3] flex items-center gap-4">
          <SearchIcon className="w-5 h-5 text-neutral-400" />
          <input
            type="text"
            placeholder="Search linen, dresses, tops, coats..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
            className="flex-1 text-base tracking-wide placeholder:text-neutral-400 focus:outline-none"
          />
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1 hover:opacity-60"
            aria-label="Close search"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-6">
          {query.trim() === '' ? (
            <div>
              <p className="text-[11px] font-bold tracking-widest uppercase text-[#526b81] mb-3">
                Suggested Searches
              </p>
              <div className="flex flex-wrap gap-2">
                {['Linen Midi', 'Riva Tank', 'The Wren Coat', 'Brisa Overshirt'].map(term => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-3 py-1.5 bg-[#edebe7] hover:bg-[#dedad4] text-[12px] font-medium tracking-wide rounded-[2px] text-[#2a3743]"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-8 text-neutral-500">
              <p className="text-sm">No results found for &quot;{query}&quot;.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {results.map(product => (
                <div
                  key={product.id}
                  className="flex items-center gap-4 p-2 rounded hover:bg-[#fafaf8]"
                >
                  <div className="relative w-14 h-[72px] bg-[#edebe7] rounded-[2px] overflow-hidden shrink-0">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[14px] font-medium text-[#2a3743] truncate">
                      {product.title}
                    </h4>
                    <p className="text-[12px] text-[#526b81] font-mono mt-0.5">${product.price}</p>
                  </div>
                  <button
                    onClick={() => {
                      addToCart(product, 1);
                      setIsSearchOpen(false);
                    }}
                    className="px-3 py-1.5 bg-[#2a3743] text-white text-[11px] font-semibold tracking-wider uppercase rounded-[2px]"
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
