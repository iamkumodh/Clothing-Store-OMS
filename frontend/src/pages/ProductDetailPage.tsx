/**
 * Product Detail & Variant Selector Page
 */
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { dfineProducts } from '../components/common/data';
import { dfineCollectionProducts } from '../components/common/collection-data';
import { fetchProductById } from '../api/productApi';
import { Product } from '../components/common/types';
import { useDfineStore } from '../context/store-context';
import { ChevronDown, Plus, Minus, X, Star } from 'lucide-react';

interface ProductDetailsViewProps {
  product: Product;
  relatedProducts: Product[];
  collectionTitle?: string;
  collectionHandle?: string;
}

export function ProductDetailsView({
  product,
  relatedProducts,
  collectionTitle = '2026 - All New',
  collectionHandle = '2026-new',
}: ProductDetailsViewProps) {
  const { addToCart, openQuickView } = useDfineStore();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes?.[0] || 'M');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<string | null>('description');
  const [showSizeChart, setShowSizeChart] = useState(false);

  // Compile image list
  const images =
    product.images && product.images.length > 0
      ? product.images
      : ([product.image, product.hoverImage].filter(Boolean) as string[]);

  const currentImage = images[selectedImageIndex] || product.image;

  const handleAddToCart = () => {
    addToCart(product, quantity, undefined, selectedSize);
  };

  const toggleAccordion = (tab: string) => {
    setActiveTab(prev => (prev === tab ? null : tab));
  };

  return (
    <div className="w-full">
      {/* Breadcrumb Navigation */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <nav className="text-[11px] tracking-wider text-[#6e7278] uppercase flex items-center gap-2">
          <Link to="/" className="hover:text-[#2a3743] transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link
            to={`/collections/${collectionHandle}`}
            className="hover:text-[#2a3743] transition-colors"
          >
            {collectionTitle}
          </Link>
          <span>/</span>
          <span className="text-[#2a3743] font-medium truncate">{product.title}</span>
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
                    className={`relative w-16 h-24 sm:w-20 sm:h-28 overflow-hidden bg-[#f4f2ee] transition-all border ${
                      selectedImageIndex === idx
                        ? 'border-[#2a3743] ring-1 ring-[#2a3743]'
                        : 'border-transparent opacity-75 hover:opacity-100'
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
            <div className="relative flex-1 aspect-[2/3] sm:aspect-[3/4] bg-[#f4f2ee] overflow-hidden group">
              <img
                src={currentImage}
                alt={product.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />

              {/* Tag/Badge */}
              {product.badge && (
                <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-[#2a3743] text-[11px] font-semibold uppercase tracking-[0.15em] px-3 py-1">
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
                      className={`w-2 h-2 rounded-full transition-all ${
                        selectedImageIndex === idx ? 'bg-[#2a3743] w-4' : 'bg-black/30'
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
              <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#2a3743] tracking-tight mb-3">
                {product.title}
              </h1>

              {/* Sales Point / Leaf Badge */}
              <div className="flex items-center gap-2 text-xs text-[#2a3743] font-medium mb-3">
                <svg
                  className="w-4 h-4 text-[#2a3743]"
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
                <span className="text-xl font-normal text-[#2a3743]">${product.price}</span>
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <span className="text-sm text-[#888] line-through">
                    ${product.compareAtPrice}
                  </span>
                )}
                <span className="text-[11px] text-[#6e7278] tracking-widest uppercase">USD</span>
              </div>
            </div>

            {/* Editorial Description & Bullets */}
            <div className="text-xs sm:text-sm text-[#4a5568] leading-relaxed space-y-3 border-t border-b border-[#e5e5e5] py-4">
              <p>
                {product.description ||
                  'The Ceru Knit is a soft textured sweater with an easy, relaxed shape. Made in a warm ivory knit, it features a classic crew neckline, dropped shoulders, and a slightly cropped length that works beautifully with tailored or relaxed bottoms.'}
              </p>
              {product.features && product.features.length > 0 && (
                <ul className="list-disc pl-5 space-y-1 text-xs text-[#555]">
                  {product.features.map((feat, idx) => (
                    <li key={idx}>{feat}</li>
                  ))}
                </ul>
              )}
              <p className="italic text-xs text-[#6e7278]">
                It’s an effortless knit that adds warmth and softness without overwhelming the rest
                of the look.
              </p>
            </div>

            {/* Size Selector & Size Chart */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] uppercase tracking-[0.15em] font-semibold text-[#2a3743]">
                    Size: <span className="font-normal text-[#6e7278]">{selectedSize}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowSizeChart(true)}
                    className="text-[11px] uppercase tracking-wider text-[#6e7278] hover:text-[#2a3743] underline transition-colors"
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
                      className={`min-w-[46px] h-10 px-3 text-xs tracking-wider uppercase border transition-all duration-150 ${
                        selectedSize === s
                          ? 'border-[#2a3743] bg-[#2a3743] text-white font-medium'
                          : 'border-[#d6d6d6] bg-white text-[#2a3743] hover:border-[#2a3743]'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Inventory Status */}
            <div className="flex items-center gap-2 text-xs text-[#2a3743]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>In stock, ready to ship</span>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-[#d6d6d6] h-12 w-28 bg-white">
                  <button
                    type="button"
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-9 h-full flex items-center justify-center text-[#6e7278] hover:text-[#2a3743]"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="flex-1 text-center text-xs font-medium text-[#2a3743]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(q => q + 1)}
                    className="w-9 h-full flex items-center justify-center text-[#6e7278] hover:text-[#2a3743]"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 h-12 bg-[#2a3743] hover:bg-black text-white text-[12px] uppercase tracking-[0.2em] font-semibold transition-all duration-200"
                >
                  Add to cart
                </button>
              </div>
            </div>

            {/* Accordion Tabs */}
            <div className="border-t border-[#e5e5e5] divide-y divide-[#e5e5e5] pt-4">
              {/* Tab 1: Description */}
              <div className="py-3.5">
                <button
                  type="button"
                  onClick={() => toggleAccordion('description')}
                  className="w-full flex items-center justify-between text-left group"
                >
                  <span className="text-[12px] uppercase tracking-[0.15em] font-semibold text-[#2a3743]">
                    Description
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#6e7278] transition-transform duration-200 ${
                      activeTab === 'description' ? 'rotate-180 text-[#2a3743]' : ''
                    }`}
                  />
                </button>
                {activeTab === 'description' && (
                  <div className="pt-3 text-xs text-[#555] leading-relaxed">
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
                  className="w-full flex items-center justify-between text-left group"
                >
                  <span className="text-[12px] uppercase tracking-[0.15em] font-semibold text-[#2a3743]">
                    Materials &amp; Care
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#6e7278] transition-transform duration-200 ${
                      activeTab === 'materials' ? 'rotate-180 text-[#2a3743]' : ''
                    }`}
                  />
                </button>
                {activeTab === 'materials' && (
                  <div className="pt-3 text-xs text-[#555] leading-relaxed space-y-2">
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
                  className="w-full flex items-center justify-between text-left group"
                >
                  <span className="text-[12px] uppercase tracking-[0.15em] font-semibold text-[#2a3743]">
                    Certifications
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#6e7278] transition-transform duration-200 ${
                      activeTab === 'certifications' ? 'rotate-180 text-[#2a3743]' : ''
                    }`}
                  />
                </button>
                {activeTab === 'certifications' && (
                  <div className="pt-3 text-xs text-[#555] leading-relaxed grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2a3743]"></span>
                      <span>Certified Organic</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2a3743]"></span>
                      <span>Ethically Sourced</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2a3743]"></span>
                      <span>Fair Trade Certified</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2a3743]"></span>
                      <span>Quality Assured</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2a3743]"></span>
                      <span>Sustainable Materials</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2a3743]"></span>
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
                  className="w-full flex items-center justify-between text-left group"
                >
                  <span className="text-[12px] uppercase tracking-[0.15em] font-semibold text-[#2a3743]">
                    Shipping &amp; Returns
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#6e7278] transition-transform duration-200 ${
                      activeTab === 'shipping' ? 'rotate-180 text-[#2a3743]' : ''
                    }`}
                  />
                </button>
                {activeTab === 'shipping' && (
                  <div className="pt-3 text-xs text-[#555] leading-relaxed space-y-2">
                    <p>
                      We ship orders within 2-3 business days. Standard delivery takes 5-7 business
                      days. Express shipping is available at checkout for faster delivery.
                    </p>
                    <p>
                      Items can be returned within 30 days of purchase in original condition with
                      tags attached. Return shipping is free on orders over $75. Refunds are
                      processed within 5-7 business days of receiving your return.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Social Sharing */}
            <div className="pt-2 flex items-center gap-4 text-xs text-[#6e7278]">
              <span className="uppercase tracking-wider text-[11px] font-medium text-[#2a3743]">
                Share:
              </span>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#2a3743] transition-colors"
              >
                Facebook
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#2a3743] transition-colors"
              >
                X (Twitter)
              </a>
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#2a3743] transition-colors"
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
          <div className="bg-white max-w-lg w-full p-6 sm:p-8 relative">
            <button
              onClick={() => setShowSizeChart(false)}
              className="absolute top-4 right-4 text-[#6e7278] hover:text-black"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-serif text-2xl font-normal text-[#2a3743] mb-4">Size Guide</h3>
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#e5e5e5] text-[#2a3743]">
                    <th className="py-2.5 font-semibold">US Size</th>
                    <th className="py-2.5 font-semibold">Standard</th>
                    <th className="py-2.5 font-semibold">UK</th>
                    <th className="py-2.5 font-semibold">Europe</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0f0f0] text-[#555]">
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
                className="bg-[#2a3743] text-white text-[11px] uppercase tracking-widest px-6 py-2.5"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Section: "You may also like" Recommendations */}
      {relatedProducts && relatedProducts.length > 0 && (
        <section className="border-t border-[#e5e5e5] mt-20 pt-16 pb-12">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif text-2xl md:text-3xl font-normal text-[#2a3743] text-center mb-10">
              You may also like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {relatedProducts.slice(0, 5).map(item => (
                <div key={item.id} className="group relative flex flex-col">
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#f4f2ee]">
                    <Link
                      to={`/collections/2026-new/products/${item.handle}`}
                      className="block w-full h-full relative"
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
                      className="absolute bottom-[10px] left-[10px] right-[10px] w-[calc(100%-20px)] z-20 bg-[#2a3743] hover:bg-black text-white text-[13px] font-normal tracking-[0.35px] py-1.5 px-1 text-center opacity-0 translate-y-[5px] group-hover:opacity-100 group-hover:translate-y-0 transition-[opacity,transform,background-color] duration-250 ease-out cursor-pointer rounded-none"
                    >
                      Quick View
                    </button>
                  </div>

                  <div className="pt-2 flex flex-col">
                    <Link
                      to={`/collections/2026-new/products/${item.handle}`}
                      className="text-xs text-[#2a3743] hover:text-black line-clamp-1"
                    >
                      {item.title}
                    </Link>
                    <span className="text-xs text-[#6e7278] mt-0.5">${item.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Section: "Hear it from them" Testimonial */}
      <section className="bg-[#f9f8f6] py-16 px-4 my-8">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#6e7278]">
            Hear it from them
          </span>
          <div className="flex justify-center gap-1 text-[#2a3743]">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-current text-[#2a3743]" />
            ))}
          </div>
          <blockquote className="font-serif text-xl sm:text-2xl font-normal text-[#2a3743] italic leading-relaxed pt-2">
            &ldquo;Couldn&apos;t be happier with the service I received from this company.&rdquo;
          </blockquote>
          <div className="text-xs uppercase tracking-widest text-[#6e7278] pt-1">
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
