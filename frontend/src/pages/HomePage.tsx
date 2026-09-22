/**
 * Storefront Home Page
 */

import React, { useState, useEffect } from 'react';
import { ShoppableHeroSection } from '../components/home/ShoppableHeroSection';
import { FeaturedCategoriesSection } from '../components/home/FeaturedCategoriesSection';
import { ProductGridSection } from '../components/home/ProductGridSection';
import { PromoGridSection } from '../components/home/PromoGridSection';

import { SlideshowBannerSection } from '../components/home/SlideshowBannerSection';
import { ImageMosaicGridSection } from '../components/home/ImageMosaicGridSection';
import { ValuePropsSection } from '../components/home/ValuePropsSection';
import { dfineProducts } from '../components/common/data';
import { fetchProducts } from '../api/productApi';
import { Product } from '../components/common/types';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>(dfineProducts);

  useEffect(() => {
    fetchProducts().then(liveProducts => {
      if (liveProducts && liveProducts.length > 0) {
        setProducts(liveProducts);
      }
    });
  }, []);

  const essentialsProducts = products.slice(0, 5);
  const allNewProducts = products.slice(5, 10);

  return (
    <div className="w-full">
      <ShoppableHeroSection />

      <section id="collection">
        <FeaturedCategoriesSection />
      </section>

      <ProductGridSection
        id="essentials"
        title="Everyday Essentials"
        subtitle="Curated Capsule"
        products={essentialsProducts}
      />

      <PromoGridSection />

      <ProductGridSection
        id="all-new"
        title="All New"
        subtitle="New This Week"
        products={allNewProducts.length > 0 ? allNewProducts : essentialsProducts}
      />

      <SlideshowBannerSection />
      <ImageMosaicGridSection />
      <ValuePropsSection />
    </div>
  );
}
