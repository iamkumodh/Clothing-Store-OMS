/**
 * Interactive T-Shirt Fabric & Fit Guide Section
 * Allows customers to explore GSM textile weights and silhouette cuts.
 */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface GsmSpec {
  gsm: number;
  label: string;
  badge: string;
  cotton: string;
  drape: string;
  collar: string;
  bestFor: string;
  recommendedStyles: string;
  link: string;
}

const gsmSpecs: Record<number, GsmSpec> = {
  180: {
    gsm: 180,
    label: 'Everyday Light & Breathable',
    badge: 'Lightweight Comfort',
    cotton: '100% Long-Staple Peruvian Pima & Combed Cotton',
    drape: 'Fluid, ultra-soft, body-skimming without clinging',
    collar: '0.75" fine ribbed binding for sleek low-profile necklines',
    bestFor: 'Warm humid days, active daily wear, layering under jackets or overshirts',
    recommendedStyles: 'Classic Pima Everyday Crew, Relaxed Baby Tee',
    link: '/collections/all?gsm=180',
  },
  220: {
    gsm: 220,
    label: 'Midweight Structured Daily',
    badge: 'All-Season Balance',
    cotton: '100% Ring-Spun Combed Cotton with Vintage Enzyme Wash',
    drape: 'Subtle structure that holds its form while remaining supple',
    collar: '1.0" double-stitched durable rib collar',
    bestFor: 'Year-round daily rotation, vintage washed looks, relaxed streetwear styling',
    recommendedStyles: 'Vintage Pigment-Dyed Crew, Washed Boyfriend Drop Tee',
    link: '/collections/all?gsm=220',
  },
  260: {
    gsm: 260,
    label: 'Heavyweight Streetwear Canvas',
    badge: 'Max Density & Structure',
    cotton: '100% Heavyweight Organic Combed Jersey',
    drape: 'Architectural boxy drape. Hangs straight from the shoulders with zero cling',
    collar: '1.25" thick reinforced anti-sag collar (guaranteed shape retention)',
    bestFor: 'True oversized streetwear, statement silhouettes, zero transparency',
    recommendedStyles: 'Minimalist Signature Heavy Tee, Heavyweight Blank Boxy Tee',
    link: '/collections/all?gsm=260',
  },
};

const silhouettes = [
  {
    name: 'Boxy Oversized',
    tag: 'Streetwear Signature',
    description: 'Dropped shoulder seams, wide chest, and slightly cropped straight hem. Ideal for streetwear layering.',
    link: '/collections/all?fit=Oversized',
  },
  {
    name: 'Relaxed Everyday',
    tag: 'Daily Balance',
    description: 'Slightly roomier through the chest with natural shoulder points. Effortless for all body shapes.',
    link: '/collections/all?fit=Relaxed',
  },
  {
    name: 'Classic Regular',
    tag: 'Timeless Standard',
    description: 'Tailored shoulder seam, clean chest profile, and standard length. Perfect standalone or layered.',
    link: '/collections/all?fit=Classic',
  },
];

export function TShirtGuideSection() {
  const [selectedGsm, setSelectedGsm] = useState<number>(260);
  const activeSpec = gsmSpecs[selectedGsm];

  return (
    <section id="gsm-guide" className="py-20 bg-neutral-50 border-y border-zinc-200">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-neutral-500">
            D'fine Textile Engineering
          </span>
          <h2 className="text-3xl sm:text-4xl font-medium tracking-tight text-neutral-900 mt-2">
            The Fabric & Silhouette Guide
          </h2>
          <p className="text-[14px] text-neutral-600 mt-3 leading-relaxed">
            Eliminate sizing and fabric uncertainty. Understand GSM fabric weight and fit cuts before selecting your piece.
          </p>
        </div>

        {/* GSM Weight Interactive Module */}
        <div className="bg-white rounded-md border border-zinc-200 shadow-sm p-6 sm:p-10 mb-14">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-zinc-100 gap-4">
            <div>
              <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-widest">
                Interactive Textile Selector
              </span>
              <h3 className="text-xl font-semibold text-neutral-900 mt-0.5">
                Fabric Density (GSM Weight)
              </h3>
            </div>

            {/* GSM Tabs */}
            <div className="flex items-center gap-2 bg-neutral-100 p-1.5 rounded-lg border border-zinc-200 self-start sm:self-auto">
              {[180, 220, 260].map(gsm => (
                <button
                  key={gsm}
                  onClick={() => setSelectedGsm(gsm)}
                  className={`px-4 py-2 text-[12px] font-bold uppercase tracking-wider rounded-md transition-all cursor-pointer ${
                    selectedGsm === gsm
                      ? 'bg-black text-white shadow-xs'
                      : 'text-neutral-600 hover:text-black hover:bg-neutral-200/60'
                  }`}
                >
                  {gsm} GSM
                </button>
              ))}
            </div>
          </div>

          {/* Active GSM Spec Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 items-center">
            {/* Left Highlights */}
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-block bg-neutral-900 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-xs">
                {activeSpec.badge}
              </div>
              <h4 className="text-2xl font-semibold text-neutral-900">
                {selectedGsm} GSM — {activeSpec.label}
              </h4>
              <p className="text-[14px] text-neutral-600 leading-relaxed">
                {activeSpec.drape}
              </p>

              <div className="pt-3">
                <Link
                  to={activeSpec.link}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-900 text-white hover:bg-black text-[12px] font-bold tracking-wider uppercase rounded-xs transition-colors"
                >
                  <span>Shop {selectedGsm} GSM Tees</span>
                  <span>→</span>
                </Link>
              </div>
            </div>

            {/* Right Spec Grid */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-neutral-50 rounded border border-zinc-200/80">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                  Textile Composition
                </span>
                <p className="text-[13px] font-medium text-neutral-900 leading-snug">
                  {activeSpec.cotton}
                </p>
              </div>

              <div className="p-4 bg-neutral-50 rounded border border-zinc-200/80">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                  Neckline & Ribbing
                </span>
                <p className="text-[13px] font-medium text-neutral-900 leading-snug">
                  {activeSpec.collar}
                </p>
              </div>

              <div className="p-4 bg-neutral-50 rounded border border-zinc-200/80">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                  Ideal Environment
                </span>
                <p className="text-[13px] font-medium text-neutral-900 leading-snug">
                  {activeSpec.bestFor}
                </p>
              </div>

              <div className="p-4 bg-neutral-50 rounded border border-zinc-200/80">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                  Featured Styles
                </span>
                <p className="text-[13px] font-medium text-neutral-900 leading-snug">
                  {activeSpec.recommendedStyles}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Fit Silhouettes Grid */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-400">
                Fit Silhouettes
              </span>
              <h3 className="text-2xl font-semibold text-neutral-900 mt-1">
                Engineered Cuts & Shapes
              </h3>
            </div>
            <Link
              to="/collections/all"
              className="text-[12px] font-bold uppercase tracking-wider text-neutral-900 hover:underline mt-2 sm:mt-0"
            >
              View Full Sizing Chart →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {silhouettes.map((fit, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-md border border-zinc-200 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-xs">
                      {fit.tag}
                    </span>
                  </div>
                  <h4 className="text-lg font-semibold text-neutral-900">
                    {fit.name}
                  </h4>
                  <p className="text-[13px] text-neutral-600 mt-2 leading-relaxed">
                    {fit.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-100">
                  <Link
                    to={fit.link}
                    className="text-[12px] font-bold text-neutral-900 hover:text-black uppercase tracking-wider flex items-center justify-between"
                  >
                    <span>Browse {fit.name}</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
