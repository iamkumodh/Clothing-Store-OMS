/**
 * Site Footer - Brand Information & Links
 */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  DfineLogo,
  CheckIcon,
  InstagramIcon,
  FacebookIcon,
  YouTubeIcon,
  TikTokIcon,
} from '../common/icons';

export function SiteFooter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
  };

  return (
    <footer className="bg-white text-[#0a0a0a] pt-16 pb-12 border-t border-zinc-200">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-zinc-200">
          {/* Brand Info */}
          <div className="space-y-4">
            <DfineLogo className="text-black" />
            <p className="text-[13px] text-zinc-500 font-light leading-relaxed max-w-[280px]">
              Precision streetwear apparel thoughtfully crafted from heavyweight spandex stretch,
              French Terry, and garment-dyed cotton.
            </p>
            <div className="flex items-center gap-4 pt-1 text-zinc-500">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-black transition-colors"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-black transition-colors"
                aria-label="Facebook"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-black transition-colors"
                aria-label="YouTube"
              >
                <YouTubeIcon className="w-4 h-4" />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-black transition-colors"
                aria-label="TikTok"
              >
                <TikTokIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* SHOP */}
          <div>
            <h4 className="text-[12px] font-bold tracking-wider uppercase text-[#0a0a0a] mb-4">
              Shop
            </h4>
            <ul className="space-y-2.5 text-[13px] text-zinc-600">
              <li>
                <Link to="/collections/spandex" className="hover:text-black transition-colors">
                  Spandex Series
                </Link>
              </li>
              <li>
                <Link to="/collections/terry" className="hover:text-black transition-colors">
                  French Terry
                </Link>
              </li>
              <li>
                <Link to="/collections/dye" className="hover:text-black transition-colors">
                  Garment Dye
                </Link>
              </li>
              <li>
                <Link to="/collections/all" className="hover:text-black transition-colors">
                  All T-Shirts
                </Link>
              </li>
              <li>
                <Link to="#hero" className="hover:text-black transition-colors">
                  The Linen Edit
                </Link>
              </li>
              <li>
                <Link to="#essentials" className="text-black font-semibold hover:opacity-80 transition-opacity">
                  Sale
                </Link>
              </li>
            </ul>
          </div>

          {/* THE COMPANY */}
          <div>
            <h4 className="text-[12px] font-bold tracking-wider uppercase text-[#0a0a0a] mb-4">
              The Company
            </h4>
            <ul className="space-y-2.5 text-[13px] text-zinc-600">
              <li>
                <Link to="/collections/2026-new" className="hover:text-black transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/collections/2026-new" className="hover:text-black transition-colors">
                  Our Story
                </Link>
              </li>
              <li>
                <Link to="/collections/2026-new" className="hover:text-black transition-colors">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* GET HELP */}
          <div>
            <h4 className="text-[12px] font-bold tracking-wider uppercase text-[#0a0a0a] mb-4">
              Get Help
            </h4>
            <ul className="space-y-2.5 text-[13px] text-zinc-600">
              <li>
                <Link to="#essentials" className="hover:text-black transition-colors">
                  Customer Service
                </Link>
              </li>
              <li>
                <Link to="#essentials" className="hover:text-black transition-colors">
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link to="#essentials" className="hover:text-black transition-colors">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link to="#essentials" className="hover:text-black transition-colors">
                  Order Status
                </Link>
              </li>
              <li>
                <Link to="#essentials" className="hover:text-black transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Form */}
          <div className="space-y-3">
            <h4 className="text-[12px] font-bold tracking-wider uppercase text-[#0a0a0a]">
              Sign up for D'fine updates
            </h4>
            <p className="text-[13px] text-zinc-500 font-light leading-relaxed">
              Enjoy 10% off your first order, plus private invitations to seasonal drops.
            </p>

            {subscribed ? (
              <div className="flex items-center gap-2 text-emerald-700 text-xs font-medium pt-2">
                <CheckIcon className="w-4 h-4" />
                <span>Thank you for subscribing!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex items-center gap-2 pt-1">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="flex-1 px-3 py-2.5 bg-zinc-50 text-[#0a0a0a] placeholder:text-zinc-400 text-[13px] rounded-[2px] border border-zinc-300 focus:border-black focus:outline-none transition-colors"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-black text-white hover:bg-zinc-800 transition-colors text-[12px] font-semibold tracking-wider uppercase rounded-[2px] cursor-pointer"
                >
                  Join
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] text-zinc-500">
          <p>© {new Date().getFullYear()} D'FINE CLOTHING STORE. ALL RIGHTS RESERVED.</p>
          <div className="flex items-center gap-5">
            <span className="hover:text-black cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-black cursor-pointer transition-colors">Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
