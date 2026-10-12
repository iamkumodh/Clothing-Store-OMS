// product detail page

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Minus, Plus, ChevronDown, X, CheckCircle2 } from 'lucide-react';
import { Product } from '../components/common/types';
import { dfineProducts } from '../components/common/data';
import { dfineCollectionProducts } from '../components/common/collection-data';
import { fetchProductById, submitProductReview } from '../api/productApi';
import { useDfineStore } from '../context/store-context';

interface ProductDetailsViewProps {
  product: Product;
  relatedProducts?: Product[];
  collectionTitle?: string;
  collectionHandle?: string;
}

export function ProductDetailsView({
  product,
  relatedProducts = [],
  collectionTitle = '2026 - All New',
  collectionHandle = '2026-new',
}: ProductDetailsViewProps) {
  const { addToCart, openQuickView } = useDfineStore();
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes?.[0] || 'M');
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<string | null>('description');
  const [showSizeChart, setShowSizeChart] = useState<boolean>(false);

  // Module 2 Reviews & Live Inventory States
  const canonicalProductId = Number(product.id) || (product.variants?.[0]?.variantId ? Math.ceil(product.variants[0].variantId / 3) : 1);
  const [reviewsList, setReviewsList] = useState(product.reviews || []);
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewAuthor, setReviewAuthor] = useState<string>('Kavindu Bandara');
  const [reviewComment, setReviewComment] = useState<string>('');
  const [reviewSubmitting, setReviewSubmitting] = useState<boolean>(false);
  const [reviewNotice, setReviewNotice] = useState<{ message: string; autoApproved: boolean } | null>(null);

  // Variant matching & Stock urgency
  const activeVariant = product.variants?.find(v => v.size === selectedSize);
  const variantStock = activeVariant?.stockQuantity ?? (product.inStock ? 18 : 0);
  const lowStockThreshold = activeVariant?.lowStockThreshold ?? 5;
  const isOutOfStock = variantStock === 0;
  const isLowStock = variantStock > 0 && variantStock <= lowStockThreshold;

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    setReviewSubmitting(true);
    try {
      const isAuto = reviewRating >= 3 && !reviewComment.toLowerCase().includes('spam');
      const newRev = await submitProductReview({
        productId: canonicalProductId,
        customerId: 1, // Kavindu Bandara default verified buyer
        rating: reviewRating,
        reviewComment: reviewComment.trim(),
        autoApprove: isAuto,
      });

      if (newRev.isApproved) {
        setReviewsList(prev => [
          {
            reviewId: newRev.reviewId,
            customerName: reviewAuthor,
            rating: newRev.rating,
            reviewComment: newRev.reviewComment || '',
            reviewDate: newRev.createdAt,
          },
          ...prev,
        ]);
        setReviewNotice({
          message: 'Thank you! Your verified review has been auto-approved and published.',
          autoApproved: true,
        });
      } else {
        setReviewNotice({
          message: 'Thank you! Your feedback has been received and queued for review moderation.',
          autoApproved: false,
        });
      }
      setReviewComment('');
    } catch (err: any) {
      alert(err.message || 'Failed to submit review');
    } finally {
      setReviewSubmitting(false);
    }
  };

  const images =
    product.images && product.images.length > 0
      ? product.images
      : ([product.image, product.hoverImage].filter(Boolean) as string[]);

  const currentImage = images[selectedImageIndex] || product.image;

  const toggleAccordion = (tab: string) => {
    setActiveTab(prev => (prev === tab ? null : tab));
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity, undefined, selectedSize);
  };

  return (
    <div className="w-full">
      {/* Breadcrumb Navigation */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <nav className="text-[11px] tracking-wider text-zinc-500 uppercase flex items-center gap-2">
          <Link to="/" className="hover:text-black transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link
            to={`/collections/${collectionHandle}`}
            className="hover:text-black transition-colors"
          >
            {collectionTitle}
          </Link>
          <span>/</span>
          <span className="text-[#0a0a0a] font-medium truncate">{product.title}</span>
        </nav>
      </div>

      {/* Main Product Section: Two Columns */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          {/* Left Column: Gallery (Thumbnails + Main Image) */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4 sticky top-24">
            {/* Vertical Thumbnails (Desktop) */}
            {images.length > 1 && (
              <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible shrink-0 pb-2 md:pb-0">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-16 h-24 sm:w-20 sm:h-28 overflow-hidden bg-zinc-100 transition-all border cursor-pointer ${
                      selectedImageIndex === idx
                        ? 'border-black ring-1 ring-black'
                        : 'border-zinc-200 opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.title} thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Main Image Viewport */}
            <div className="relative flex-1 aspect-[2/3] sm:aspect-[3/4] bg-zinc-100 overflow-hidden group border border-zinc-200">
              <img
                src={currentImage}
                alt={product.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />

              {/* Tag/Badge */}
              {product.badge && (
                <span className="absolute top-4 left-4 bg-white text-[#0a0a0a] border border-zinc-200 text-[11px] font-semibold uppercase tracking-[0.15em] px-3 py-1">
                  {product.badge}
                </span>
              )}

              {/* Dots on mobile */}
              {images.length > 1 && (
                <div className="md:hidden absolute bottom-4 inset-x-0 flex justify-center gap-1.5 z-10">
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                        selectedImageIndex === idx ? 'bg-black w-4' : 'bg-black/30'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Meta & Buy Box */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#0a0a0a] tracking-tight mb-3">
                {product.title}
              </h1>

              {/* Sales Point / Leaf Badge */}
              <div className="flex items-center gap-2 text-xs text-[#0a0a0a] font-medium mb-3">
                <svg
                  className="w-4 h-4 text-[#0a0a0a]"
                  viewBox="0 0 64 64"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M52 11 13 50m22-37v15h16" />
                  <path d="M52 11c6 24-16.72 47.29-33 32C7 22 29 10 52 11Z" />
                </svg>
                <span>{product.material || 'Organic cotton'}</span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3">
                <span className="text-xl font-normal text-[#0a0a0a]">
                  LKR {Number(product.price).toLocaleString()}
                </span>
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <span className="text-sm text-zinc-500 line-through">
                    LKR {Number(product.compareAtPrice).toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            {/* Editorial Description & Bullets */}
            <div className="text-xs sm:text-sm text-zinc-600 leading-relaxed space-y-3 border-t border-b border-zinc-200 py-4">
              <p>
                {product.description ||
                  'The Ceru Knit is a soft textured sweater with an easy, relaxed shape. Made in a warm ivory knit, it features a classic crew neckline, dropped shoulders, and a slightly cropped length that works beautifully with tailored or relaxed bottoms.'}
              </p>
              {product.features && product.features.length > 0 && (
                <ul className="list-disc pl-5 space-y-1 text-xs text-zinc-600">
                  {product.features.map((feat, idx) => (
                    <li key={idx}>{feat}</li>
                  ))}
                </ul>
              )}
              <p className="italic text-xs text-zinc-500">
                It’s an effortless knit that adds warmth and softness without overwhelming the rest
                of the look.
              </p>
            </div>

            {/* Size Selector & Size Chart */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] uppercase tracking-[0.15em] font-semibold text-[#0a0a0a]">
                    Size: <span className="font-normal text-zinc-500">{selectedSize}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowSizeChart(true)}
                    className="text-[11px] uppercase tracking-wider text-zinc-500 hover:text-black underline transition-colors cursor-pointer"
                  >
                    Size chart
                  </button>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {product.sizes.map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSelectedSize(s)}
                      className={`min-w-[46px] h-10 px-3 text-xs tracking-wider uppercase border transition-all duration-150 cursor-pointer ${
                        selectedSize === s
                          ? 'border-black bg-black text-white font-medium'
                          : 'border-zinc-300 bg-white text-[#0a0a0a] hover:border-black'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Inventory Status with Live Urgency */}
            <div className="flex items-center gap-2 text-xs">
              {isOutOfStock ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  <span className="text-rose-700 font-medium">Sold Out in size {selectedSize}</span>
                </>
              ) : isLowStock ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                  <span className="text-amber-800 font-medium">
                    Only {variantStock} left in stock ({selectedSize}) — Order soon
                  </span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-emerald-800 font-medium">
                    In stock ({variantStock} units), ready to dispatch
                  </span>
                </>
              )}
            </div>

            {/* Quantity & Add to Cart */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-zinc-300 h-12 w-28 bg-white">
                  <button
                    type="button"
                    disabled={isOutOfStock}
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                    className="w-9 h-full flex items-center justify-center text-zinc-500 hover:text-black cursor-pointer disabled:opacity-30 focus-visible:ring-1 focus-visible:ring-zinc-950 focus-visible:outline-none"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="flex-1 text-center text-xs font-medium text-[#0a0a0a]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    disabled={isOutOfStock}
                    onClick={() => setQuantity(q => q + 1)}
                    aria-label="Increase quantity"
                    className="w-9 h-full flex items-center justify-center text-zinc-500 hover:text-black cursor-pointer disabled:opacity-30 focus-visible:ring-1 focus-visible:ring-zinc-950 focus-visible:outline-none"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  type="button"
                  disabled={isOutOfStock}
                  onClick={handleAddToCart}
                  className={`flex-1 h-12 text-[12px] uppercase tracking-[0.2em] font-semibold transition-all duration-200 ${
                    isOutOfStock
                      ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                      : 'bg-black hover:bg-zinc-800 text-white cursor-pointer'
                  }`}
                >
                  {isOutOfStock ? 'Sold out' : 'Add to cart'}
                </button>
              </div>
            </div>

            {/* Accordion Tabs */}
            <div className="border-t border-zinc-200 divide-y divide-zinc-200 pt-4">
              {/* Tab 1: Description */}
              <div className="py-3.5">
                <button
                  type="button"
                  onClick={() => toggleAccordion('description')}
                  className="w-full flex items-center justify-between text-left group cursor-pointer"
                >
                  <span className="text-[12px] uppercase tracking-[0.15em] font-semibold text-[#0a0a0a]">
                    Description
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-zinc-500 transition-transform duration-200 ${
                      activeTab === 'description' ? 'rotate-180 text-black' : ''
                    }`}
                  />
                </button>
                {activeTab === 'description' && (
                  <div className="pt-3 text-xs text-zinc-600 leading-relaxed">
                    Crafted from premium linen, this piece offers natural breathability and a
                    relaxed elegance. Linen&apos;s inherent texture creates a beautifully lived-in
                    look that softens with every wear, while its lightweight construction makes it
                    perfect for warm weather. The fabric drapes gracefully, providing comfortable
                    movement throughout your day. Easy to care for and designed to develop character
                    over time, this linen essential is a timeless addition to any wardrobe.
                  </div>
                )}
              </div>

              {/* Tab 2: Materials & Care */}
              <div className="py-3.5">
                <button
                  type="button"
                  onClick={() => toggleAccordion('materials')}
                  className="w-full flex items-center justify-between text-left group cursor-pointer"
                >
                  <span className="text-[12px] uppercase tracking-[0.15em] font-semibold text-[#0a0a0a]">
                    Materials &amp; Care
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-zinc-500 transition-transform duration-200 ${
                      activeTab === 'materials' ? 'rotate-180 text-black' : ''
                    }`}
                  />
                </button>
                {activeTab === 'materials' && (
                  <div className="pt-3 text-xs text-zinc-600 leading-relaxed space-y-2">
                    <p>
                      Our pieces are crafted from premium linen sourced from European mills known
                      for their commitment to quality and sustainable practices. Linen is a natural,
                      breathable fabric that becomes softer and more comfortable with every wear,
                      making it an ideal choice for timeless pieces like this skirt.
                    </p>
                    <p>
                      To keep your linen garment looking its best, we recommend gentle machine
                      washing in cool water or hand washing with mild detergent. Lay flat to dry to
                      maintain the fabric&apos;s natural drape and integrity. A light iron on low
                      heat can help refresh the fabric if needed. Linen&apos;s natural texture is
                      part of its charm—slight variations in color and weave are characteristics of
                      this beautiful material, not flaws.
                    </p>
                  </div>
                )}
              </div>

              {/* Tab 3: Certifications */}
              <div className="py-3.5">
                <button
                  type="button"
                  onClick={() => toggleAccordion('certifications')}
                  className="w-full flex items-center justify-between text-left group cursor-pointer"
                >
                  <span className="text-[12px] uppercase tracking-[0.15em] font-semibold text-[#0a0a0a]">
                    Certifications
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-zinc-500 transition-transform duration-200 ${
                      activeTab === 'certifications' ? 'rotate-180 text-black' : ''
                    }`}
                  />
                </button>
                {activeTab === 'certifications' && (
                  <div className="pt-3 text-xs text-zinc-600 leading-relaxed grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-black"></span>
                      <span>Certified Organic</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-black"></span>
                      <span>Ethically Sourced</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-black"></span>
                      <span>Fair Trade Certified</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-black"></span>
                      <span>Quality Assured</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-black"></span>
                      <span>Sustainable Materials</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-black"></span>
                      <span>Cruelty-Free</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Tab 4: Shipping & Returns */}
              <div className="py-3.5">
                <button
                  type="button"
                  onClick={() => toggleAccordion('shipping')}
                  className="w-full flex items-center justify-between text-left group cursor-pointer"
                >
                  <span className="text-[12px] uppercase tracking-[0.15em] font-semibold text-[#0a0a0a]">
                    Shipping &amp; Returns
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-zinc-500 transition-transform duration-200 ${
                      activeTab === 'shipping' ? 'rotate-180 text-black' : ''
                    }`}
                  />
                </button>
                {activeTab === 'shipping' && (
                  <div className="pt-3 text-xs text-zinc-600 leading-relaxed space-y-2">
                    <p>
                      We ship orders within 2-3 business days. Standard delivery takes 5-7 business
                      days. Express shipping is available at checkout for faster delivery.
                    </p>
                    <p>
                      Items can be returned within 30 days of purchase in original condition with
                      tags attached. Return shipping is free on orders over LKR 15,000. Refunds are
                      processed within 5-7 business days of receiving your return.
                    </p>
                  </div>
                )}
              </div>

              {/* Tab 5: Customer Reviews & Submission */}
              <div className="py-3.5">
                <button
                  type="button"
                  onClick={() => toggleAccordion('reviews')}
                  className="w-full flex items-center justify-between text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] uppercase tracking-[0.15em] font-semibold text-[#0a0a0a]">
                      Verified Customer Reviews ({reviewsList.length})
                    </span>
                    <span className="text-[10px] bg-zinc-100 text-zinc-600 px-1.5 py-0.5 border border-zinc-200 font-mono">
                      Module 2
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-zinc-500 transition-transform duration-200 ${
                      activeTab === 'reviews' ? 'rotate-180 text-black' : ''
                    }`}
                  />
                </button>
                {activeTab === 'reviews' && (
                  <div className="pt-4 text-xs space-y-5">
                    {/* Notice alert */}
                    {reviewNotice && (
                      <div
                        className={`p-3 border text-xs flex items-center gap-2 ${
                          reviewNotice.autoApproved
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                            : 'bg-amber-50 border-amber-200 text-amber-800'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>{reviewNotice.message}</span>
                      </div>
                    )}

                    {/* Review List */}
                    <div className="space-y-3 divide-y divide-zinc-100">
                      {reviewsList.length === 0 ? (
                        <p className="text-zinc-500 italic">No reviews yet. Be the first to review this garment!</p>
                      ) : (
                        reviewsList.map((rev, idx) => (
                          <div key={rev.reviewId || idx} className="pt-3 first:pt-0">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((s) => (
                                  <Star
                                    key={s}
                                    className={`w-3 h-3 ${
                                      s <= rev.rating
                                        ? 'text-amber-500 fill-amber-500'
                                        : 'text-zinc-200'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-[10px] text-zinc-500 font-mono">
                                {rev.reviewDate ? rev.reviewDate.substring(0, 10) : 'Verified Purchase'}
                              </span>
                            </div>
                            <div className="font-medium text-[#0a0a0a] text-[11px]">
                              {rev.customerName || 'Verified Buyer'}
                            </div>
                            <p className="text-zinc-600 mt-1 leading-relaxed">
                              &ldquo;{rev.reviewComment}&rdquo;
                            </p>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Write Review Form */}
                    <form
                      onSubmit={handleReviewSubmit}
                      className="border-t border-zinc-200 pt-4 space-y-3 bg-zinc-50 p-4 border"
                    >
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-zinc-900">
                        Leave a Customer Review
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-zinc-500 mb-1">
                          Rating Score
                        </label>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setReviewRating(star)}
                              className="p-1 hover:scale-110 transition-transform cursor-pointer"
                            >
                              <Star
                                className={`w-4 h-4 ${
                                  star <= reviewRating
                                    ? 'text-amber-500 fill-amber-500'
                                    : 'text-zinc-300'
                                }`}
                              />
                            </button>
                          ))}
                          <span className="text-xs text-zinc-600 ml-2 font-mono">
                            {reviewRating} of 5 Stars
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider text-zinc-500 mb-1">
                            Your Name
                          </label>
                          <input
                            type="text"
                            value={reviewAuthor}
                            onChange={(e) => setReviewAuthor(e.target.value)}
                            className="w-full h-8 px-2 bg-white border border-zinc-200 text-xs text-[#0a0a0a] outline-none focus:border-black"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-zinc-500 mb-1">
                          Your Feedback
                        </label>
                        <textarea
                          rows={2}
                          required
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                          placeholder="Fit, garment texture, fabric weight, drape..."
                          className="w-full p-2 bg-white border border-zinc-200 text-xs text-[#0a0a0a] outline-none focus:border-black"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={reviewSubmitting || !reviewComment.trim()}
                        className="h-9 px-4 bg-black hover:bg-zinc-800 text-white text-[10px] uppercase tracking-widest font-semibold transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        {reviewSubmitting ? 'Submitting...' : 'Post Verified Review'}
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </div>

            {/* Social Sharing */}
            <div className="pt-2 flex items-center gap-4 text-xs text-zinc-500">
              <span className="uppercase tracking-wider text-[11px] font-medium text-[#0a0a0a]">
                Share:
              </span>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-black transition-colors"
              >
                Facebook
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-black transition-colors"
              >
                X (Twitter)
              </a>
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-black transition-colors"
              >
                Pinterest
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Size Chart Modal */}
      {showSizeChart && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white max-w-lg w-full p-6 sm:p-8 relative border border-zinc-200 shadow-2xl">
            <button
              onClick={() => setShowSizeChart(false)}
              aria-label="Close size guide"
              className="absolute top-4 right-4 text-zinc-500 hover:text-black cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-serif text-2xl font-normal text-[#0a0a0a] mb-4">Size Guide</h3>
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-200 text-[#0a0a0a]">
                    <th className="py-2.5 font-semibold">US Size</th>
                    <th className="py-2.5 font-semibold">Standard</th>
                    <th className="py-2.5 font-semibold">UK</th>
                    <th className="py-2.5 font-semibold">Europe</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 text-zinc-600">
                  <tr>
                    <td className="py-2">0</td>
                    <td className="py-2">Extra Small</td>
                    <td className="py-2">4</td>
                    <td className="py-2">32</td>
                  </tr>
                  <tr>
                    <td className="py-2">2 - 4</td>
                    <td className="py-2">Small</td>
                    <td className="py-2">6 - 8</td>
                    <td className="py-2">34 - 36</td>
                  </tr>
                  <tr>
                    <td className="py-2">6 - 8</td>
                    <td className="py-2">Medium</td>
                    <td className="py-2">10</td>
                    <td className="py-2">38</td>
                  </tr>
                  <tr>
                    <td className="py-2">10 - 12</td>
                    <td className="py-2">Large</td>
                    <td className="py-2">12 - 14</td>
                    <td className="py-2">40 - 42</td>
                  </tr>
                  <tr>
                    <td className="py-2">14</td>
                    <td className="py-2">Extra Large</td>
                    <td className="py-2">16</td>
                    <td className="py-2">44</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-6 text-center">
              <button
                onClick={() => setShowSizeChart(false)}
                className="bg-black hover:bg-zinc-800 text-white text-[11px] uppercase tracking-widest px-6 py-2.5 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Section: "You may also like" Recommendations */}
      {relatedProducts && relatedProducts.length > 0 && (
        <section className="border-t border-zinc-200 mt-20 pt-16 pb-12">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif text-2xl md:text-3xl font-normal text-[#0a0a0a] text-center mb-10">
              You may also like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {relatedProducts.slice(0, 5).map(item => (
                <div key={item.id} className="group relative flex flex-col">
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-100 border border-zinc-100">
                    <Link
                      to={`/collections/2026-new/products/${item.handle}`}
                      className="block w-full h-full relative"
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-90"
                        loading="lazy"
                      />
                    </Link>

                    {/* Quick View Button (Exact 1:1 D'fine Theme) */}
                    <button
                      type="button"
                      onClick={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        openQuickView(item);
                      }}
                      className="absolute bottom-[10px] left-[10px] right-[10px] w-[calc(100%-20px)] z-20 bg-black hover:bg-zinc-800 text-white text-[13px] font-normal tracking-[0.35px] py-1.5 px-1 text-center opacity-0 translate-y-[5px] group-hover:opacity-100 group-hover:translate-y-0 transition-[opacity,transform,background-color] duration-250 ease-out cursor-pointer rounded-none"
                    >
                      Quick View
                    </button>
                  </div>

                  <div className="pt-2 flex flex-col">
                    <Link
                      to={`/collections/2026-new/products/${item.handle}`}
                      className="text-xs text-[#0a0a0a] hover:text-black line-clamp-1"
                    >
                      {item.title}
                    </Link>
                    <span className="text-xs text-zinc-500 font-mono mt-0.5">
                      LKR {Number(item.price).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Section: "Hear it from them" Testimonial */}
      <section className="bg-zinc-50 border-y border-zinc-200 py-16 px-4 my-8">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-zinc-500">
            Hear it from them
          </span>
          <div className="flex justify-center gap-1 text-black">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-current text-black" />
            ))}
          </div>
          <blockquote className="font-serif text-xl sm:text-2xl font-normal text-[#0a0a0a] italic leading-relaxed pt-2">
            &ldquo;Couldn&apos;t be happier with the service I received from this company.&rdquo;
          </blockquote>
          <div className="text-xs uppercase tracking-widest text-zinc-500 pt-1">
            Leslie M. &bull; Toronto, ON
          </div>
        </div>
      </section>
    </div>
  );
}

export default function ProductDetailPage() {
  const { handle } = useParams<{ handle: string }>();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (handle) {
      fetchProductById(handle).then(p => {
        if (p) setProduct(p);
      });
    }
  }, [handle]);

  const defaultProduct = dfineProducts[0];
  const activeProduct = product || defaultProduct;

  const relatedProducts = dfineCollectionProducts
    .filter((p: Product) => p.handle !== activeProduct.handle)
    .slice(0, 5);

  return (
    <ProductDetailsView
      key={activeProduct.id}
      product={activeProduct}
      relatedProducts={relatedProducts}
      collectionTitle="2026 - All New"
      collectionHandle="2026-new"
    />
  );
}
