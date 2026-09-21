/**
 * Data Models & TypeScript Interfaces
 */

export interface ProductVariant {
  variantId?: number;
  sku?: string;
  size?: string;
  color?: string;
  priceAdjustment?: number;
  stockQuantity?: number;
  lowStockThreshold?: number;
  stockStatus?: string;
}

export interface ProductReview {
  reviewId?: number;
  customerName?: string;
  rating: number;
  reviewComment?: string;
  reviewDate?: string;
}

export interface Product {
  id: string;
  title: string;
  handle: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  hoverImage?: string;
  images?: string[];
  category: string;
  badge?: string;
  colors?: string[];
  sizes?: string[];
  description?: string;
  features?: string[];
  material?: string;
  inStock?: boolean;
  variants?: ProductVariant[];
  reviews?: ProductReview[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface ShoppableHotspot {
  id: string;
  x: number; // desktop percentage
  y: number; // desktop percentage
  mobileX?: number; // mobile percentage
  mobileY?: number; // mobile percentage
  product: Product;
}
