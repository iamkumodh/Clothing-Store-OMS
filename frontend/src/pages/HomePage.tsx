// storefront home page

import React, { useState, useEffect } from 'react';
import { ShoppableHeroSection } from '../components/home/ShoppableHeroSection';
import { FeaturedCategoriesSection } from '../components/home/FeaturedCategoriesSection';
import { ProductGridSection } from '../components/home/ProductGridSection';
import { TShirtGuideSection } from '../components/home/TShirtGuideSection';
import { PromoGridSection } from '../components/home/PromoGridSection';
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

  // Curated product subsets for homepage showcases
  const heavyweightProducts = products
    .filter(p => (p.gsm && p.gsm >= 240) || p.fit === 'Oversized')
    .slice(0, 5);

  const graphicAndNewProducts = products
    .filter(
      p =>
        p.category?.toLowerCase().includes('graphic') ||
        p.category?.toLowerCase().includes('vintage') ||
        p.badge?.toLowerCase().includes('drop') ||
        p.badge?.toLowerCase().includes('bestseller')
    )
    .slice(0, 5);

  const fallbackFirstSet = products.slice(0, 5);
  const fallbackSecondSet = products.slice(5, 10);

  return (
    <div className="w-full">
      {/* 1. Hero with Shoppable T-Shirt Hotspots */}
      <ShoppableHeroSection />

      {/* 2. 3-Pillar Category Cards: Men, Women, Unisex */}
      <section id="categories">
        <FeaturedCategoriesSection />
      </section>

      {/* 3. Drop Grid 1: Heavyweight & Oversized Essentials */}
      <ProductGridSection
        id="heavyweight"
        title="Heavyweight Essentials"
        subtitle="240–260 GSM Drop-Shoulder"
        products={heavyweightProducts.length > 0 ? heavyweightProducts : fallbackFirstSet}
      />

      {/* 4. Interactive Fabric Weight & Fit Guide */}
      <TShirtGuideSection />

      {/* 5. Craft Stories Promo Grid: Graphic & Vintage Washed */}
      <PromoGridSection />

      {/* 6. Drop Grid 2: Graphic & Limited Artwork Tees */}
      <ProductGridSection
        id="graphic-drops"
        title="Graphic & Typography Drops"
        subtitle="Limited Run Streetwear"
        products={graphicAndNewProducts.length > 0 ? graphicAndNewProducts : fallbackSecondSet}
      />

      {/* 7. Streetwear Editorial Mosaic Grid */}
      <ImageMosaicGridSection />

      {/* 8. T-Shirt Standards & Guarantees Value Props */}
      <ValuePropsSection />
    </div>
  );
}
