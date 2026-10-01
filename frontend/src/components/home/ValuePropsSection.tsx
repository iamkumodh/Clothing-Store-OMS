/**
 * Storefront Value Propositions Section - T-Shirt Standards & Guarantees
 */
import React from 'react';

export function ValuePropsSection() {
  const values = [
    {
      title: '100% Combed & Pre-Shrunk',
      desc: 'Double-combed ring-spun cotton pre-shrunk during processing to prevent shrinkage or twisting after washing.',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L3 11.5V21h9.5z" />
          <line x1="16" y1="8" x2="2" y2="22" />
        </svg>
      ),
    },
    {
      title: 'Anti-Sag Reinforced Collar',
      desc: '1.25" thick double-needle stitched ribbed collar with shoulder-to-shoulder taping engineered to retain its neckline shape.',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      ),
    },
    {
      title: 'Islandwide Sri Lanka Delivery',
      desc: 'Fast express delivery across all 25 districts in Sri Lanka with Cash on Delivery and Bank Transfer in LKR.',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="1" y="3" width="15" height="13" />
          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
          <circle cx="5.5" cy="18.5" r="2.5" />
          <circle cx="18.5" cy="18.5" r="2.5" />
        </svg>
      ),
    },
    {
      title: '7-Day Hassle-Free Fit Exchange',
      desc: 'Unsure about Oversized vs Classic fit? Exchange for your ideal size or silhouette within 7 days with zero stress.',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <polyline points="17 1 21 5 17 9" />
          <path d="M3 11V9a4 4 0 0 1 4-4h14" />
          <polyline points="7 23 3 19 7 15" />
          <path d="M21 13v2a4 4 0 0 1-4 4H3" />
        </svg>
      ),
    },
  ];

  return (
    <section className="py-20 bg-neutral-50 text-[#0a0a0a] border-t border-zinc-200">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((v, idx) => (
            <div key={idx} className="flex flex-col items-center text-center p-6 bg-white rounded-md border border-zinc-200 shadow-xs">
              <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center mb-4 shadow-sm">
                {v.icon}
              </div>
              <h3 className="text-base font-semibold tracking-tight text-neutral-900 mb-2">
                {v.title}
              </h3>
              <p className="text-[13px] text-neutral-600 font-normal leading-relaxed">
                {v.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
