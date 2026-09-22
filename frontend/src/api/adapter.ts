/**
 * Backend DTO to Frontend Data Adapter
 */

import { Product, ProductVariant, ProductReview } from '../components/common/types';

export interface BackendVariant {
  variantId?: number;
  sku?: string;
  size?: string;
  color?: string;
  priceAdjustment?: number;
  stockQuantity?: number;
  lowStockThreshold?: number;
  stockStatus?: string;
}

export interface BackendReview {
  reviewId?: number;
  customerName?: string;
  rating: number;
  reviewComment?: string;
  createdAt?: string;
}

export interface BackendProductResponse {
  productId: number;
  productName: string;
  categoryName?: string;
  description?: string;
  genderTarget?: string;
  basePrice: number;
  mainImageUrl?: string;
  stockStatus?: string;
  variants?: BackendVariant[];
  reviews?: BackendReview[];
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function mapBackendProductToDfineProduct(bp: BackendProductResponse): Product {
  const handle = slugify(bp.productName) + `-${bp.productId}`;
  const mainImg = bp.mainImageUrl || '/images/dfine-img-000.png';

  const colors = Array.from(new Set(bp.variants?.map(v => v.color).filter(Boolean))) as string[];
  const sizes = Array.from(new Set(bp.variants?.map(v => v.size).filter(Boolean))) as string[];

  const inStock =
    bp.stockStatus !== 'OUT_OF_STOCK' &&
    (bp.variants && bp.variants.length > 0
      ? bp.variants.some(v => (v.stockQuantity ?? 0) > 0)
      : true);

  const variants: ProductVariant[] = (bp.variants || []).map(v => ({
    variantId: v.variantId,
    sku: v.sku,
    size: v.size,
    color: v.color,
    priceAdjustment: v.priceAdjustment,
    stockQuantity: v.stockQuantity,
    lowStockThreshold: v.lowStockThreshold,
    stockStatus: v.stockStatus,
  }));

  const reviews: ProductReview[] = (bp.reviews || []).map(r => ({
    reviewId: r.reviewId,
    customerName: r.customerName,
    rating: r.rating,
    reviewComment: r.reviewComment,
    reviewDate: r.createdAt,
  }));

  return {
    id: String(bp.productId),
    title: bp.productName,
    handle,
    price: Number(bp.basePrice),
    image: mainImg,
    hoverImage: mainImg,
    images: [mainImg],
    category: bp.categoryName || 'Tops',
    badge: bp.stockStatus === 'LOW_STOCK' ? 'Low Stock' : undefined,
    colors: colors.length > 0 ? colors : ['#2a3743'],
    sizes: sizes.length > 0 ? sizes : ['XS', 'S', 'M', 'L', 'XL'],
    description: bp.description || 'Thoughtfully tailored with premium finishes.',
    inStock,
    variants,
    reviews,
  };
}
