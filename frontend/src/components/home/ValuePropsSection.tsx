/**
 * Storefront Value Propositions Section
 */
import React from 'react';
import { FeatherIcon, TextureIcon, RepeatIcon } from '../common/icons';

export function ValuePropsSection() {
  const values = [
    {
      icon: FeatherIcon,
      title: 'Quietly considered',
      desc: 'Understated details that bring polish without asking for attention.',
    },
    {
      icon: TextureIcon,
      title: 'Texture you can feel',
      desc: 'From airy linen to soft knits, each fabric adds warmth, ease, and depth.',
    },
    {
      icon: RepeatIcon,
      title: 'Made for repeat wear',
      desc: 'Simple pieces, thoughtful layers, and a wardrobe that feels natural to come back to.',
    },
  ];

  return (
    <section className="py-16 bg-[#edebe7] text-[#2a3743] border-y border-[#dedad4]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {values.map((v, idx) => {
            const Icon = v.icon;
            return (
              <div key={idx} className="flex flex-col items-center space-y-3 p-4">
                <div className="w-12 h-12 rounded-full bg-[#2a3743] text-[#ffd5c1] flex items-center justify-center shadow-sm">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-medium tracking-tight text-[#2a3743]">{v.title}</h3>
                <p className="text-[14px] text-[#425567] font-light max-w-[280px] leading-relaxed">
                  {v.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
