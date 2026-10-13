// storefront home page

import React, { useState, useEffect } from 'react';
import { ShoppableHeroSection } from '../components/home/ShoppableHeroSection';
import { FeaturedCategoriesSection } from '../components/home/FeaturedCategoriesSection';
import { ProductGridSection } from '../components/home/ProductGridSection';
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
  const spandexProducts = products.filter(
    p => p.category?.toLowerCase() === 'spandex'
  );

  const terryAndDyeProducts = products.filter(
    p =>
      p.category?.toLowerCase() === 'terry' ||
      p.category?.toLowerCase() === 'dye'
  );

  return (
    <div className="w-full">
      {/* 1. Hero with Shoppable T-Shirt Hotspots */}
      <ShoppableHeroSection />

      {/* 2. 3-Pillar Category Cards: Spandex, Terry, Dye */}
      <section id="categories">
        <FeaturedCategoriesSection />
      </section>

      {/* 3. Drop Grid 1: Spandex Series */}
      <ProductGridSection
        id="spandex-drop"
        title="Spandex Series"
        subtitle="240–260 GSM Stretch & Precision Drape"
        products={spandexProducts.length > 0 ? spandexProducts : products.slice(0, 4)}
      />

      {/* 4. Craft Stories Promo Grid */}
      <PromoGridSection />

      {/* 6. Drop Grid 2: French Terry & Garment Dye Drops */}
      <ProductGridSection
        id="terry-dye-drops"
        title="French Terry & Dye Drops"
        subtitle="Micro-Loop Terry & Vintage Washed Character"
        products={terryAndDyeProducts.length > 0 ? terryAndDyeProducts : products.slice(4, 8)}
      />

      {/* 7. Streetwear Editorial Mosaic Grid */}
      <ImageMosaicGridSection />

      {/* 8. T-Shirt Standards & Guarantees Value Props */}
      <ValuePropsSection />
    </div>
  );
}
