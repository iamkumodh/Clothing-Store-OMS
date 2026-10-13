// product api client

import { apiClient, executeWithFallback } from './client';
import { mockDb } from './mockDataStore';
import { mapBackendProductToDfineProduct, BackendProductResponse } from './adapter';
import { Product } from '../components/common/types';
import type {
  Product as CanonicalProduct,
  ProductVariant,
  RestockLog,
  ProductReview,
  CreateProductDto,
  RestockLogDto,
  CreateReviewDto,
} from '../types/oms';

function canonicalToBackendResponse(p: ReturnType<typeof mockDb.getProductWithVariants>): BackendProductResponse {
  if (!p) {
    throw new Error('Product not found in canonical store');
  }
  return {
    productId: p.productId,
    productName: p.productName,
    categoryName: p.category?.categoryName || 'Tops',
    description: p.productDescription || 'Thoughtfully tailored with premium finishes.',
    genderTarget: p.genderTarget || 'UNISEX',
    basePrice: Number(p.basePrice),
    mainImageUrl: p.mainImageUrl,
    stockStatus: p.variants.some(v => v.stockQuantity > 0) ? 'IN_STOCK' : 'OUT_OF_STOCK',
    variants: p.variants.map(v => ({
      variantId: v.variantId,
      sku: v.sku,
      size: v.sizeLabel,
      color: v.color,
      stockQuantity: v.stockQuantity,
      lowStockThreshold: v.lowStockThreshold,
      stockStatus: v.stockQuantity <= v.lowStockThreshold ? 'LOW_STOCK' : 'IN_STOCK',
    })),
    reviews: (p.reviews || []).map(r => ({
      reviewId: r.reviewId,
      customerName: 'Verified Buyer',
      rating: r.rating,
      reviewComment: r.reviewComment || '',
      createdAt: r.createdAt,
    })),
  };
}

export async function fetchProducts(params?: {
  categoryId?: number;
  gender?: string;
}): Promise<Product[]> {
  return executeWithFallback(
    async () => {
      const res = await apiClient.get<BackendProductResponse[]>('/products', { params });
      return (res.data || []).map(mapBackendProductToDfineProduct);
    },
    () => {
      let list = mockDb.getProductsWithVariants();
      if (params?.categoryId) {
        list = list.filter(p => p.categoryId === params.categoryId);
      }
      if (params?.gender) {
        list = list.filter(p => p.genderTarget === params.gender || p.genderTarget === 'UNISEX');
      }
      return list.filter(p => p.isActive).map(p => mapBackendProductToDfineProduct(canonicalToBackendResponse(p)));
    }
  );
}

export async function fetchProductById(idOrHandle: string | number): Promise<Product> {
  const numId = Number(idOrHandle);
  return executeWithFallback(
    async () => {
      if (!isNaN(numId) && numId > 0) {
        const res = await apiClient.get<BackendProductResponse>(`/products/${numId}`);
        return mapBackendProductToDfineProduct(res.data);
      }
      throw new Error('Not a numeric ID');
    },
    () => {
      let canonical = !isNaN(numId) && numId > 0 ? mockDb.getProductWithVariants(numId) : undefined;
      if (!canonical) {
        // Fallback: match by title slug or product name
        const all = mockDb.getProductsWithVariants();
        const searchStr = String(idOrHandle).toLowerCase().replace(/[^a-z0-9]/g, '');
        canonical = all.find(p => {
          const pName = p.productName.toLowerCase().replace(/[^a-z0-9]/g, '');
          return pName.includes(searchStr) || searchStr.includes(pName) || String(p.productId) === String(idOrHandle);
        });
      }
      if (!canonical) {
        canonical = mockDb.getProductsWithVariants()[0];
      }
      return mapBackendProductToDfineProduct(canonicalToBackendResponse(canonical));
    }
  );
}

// Module 2 Admin Catalog Actions
export async function createProduct(dto: CreateProductDto): Promise<CanonicalProduct> {
  return executeWithFallback(
    async () => {
      const res = await apiClient.post<CanonicalProduct>('/products', dto);
      return res.data;
    },
    () => mockDb.createProduct(dto.product, dto.variants)
  );
}

export async function updateProduct(
  productId: number,
  updates: Partial<CanonicalProduct>
): Promise<CanonicalProduct> {
  return executeWithFallback(
    async () => {
      const res = await apiClient.put<CanonicalProduct>(`/products/${productId}`, updates);
      return res.data;
    },
    () => mockDb.updateProduct(productId, updates)
  );
}

export async function fetchVariants(productId?: number): Promise<ProductVariant[]> {
  return executeWithFallback(
    async () => {
      const url = productId ? `/products/${productId}/variants` : '/variants';
      const res = await apiClient.get<ProductVariant[]>(url);
      return res.data;
    },
    () => (productId ? mockDb.getVariantsByProduct(productId) : mockDb.getVariants())
  );
}

export async function restockVariant(dto: RestockLogDto): Promise<{ variant: ProductVariant; restockLog: RestockLog }> {
  return executeWithFallback(
    async () => {
      const res = await apiClient.post<{ variant: ProductVariant; restockLog: RestockLog }>('/inventory/restock', dto);
      return res.data;
    },
    () => mockDb.restockVariant(dto)
  );
}

export async function fetchRestockLogs(): Promise<RestockLog[]> {
  return executeWithFallback(
    async () => {
      const res = await apiClient.get<RestockLog[]>('/inventory/restock-logs');
      return res.data;
    },
    () => mockDb.getRestockLogs()
  );
}

// Module 2 Reviews
export async function submitProductReview(dto: CreateReviewDto): Promise<ProductReview> {
  return executeWithFallback(
    async () => {
      const res = await apiClient.post<ProductReview>(`/products/${dto.productId}/reviews`, dto);
      return res.data;
    },
    () => mockDb.createReview(dto)
  );
}

export async function fetchReviews(productId?: number): Promise<ProductReview[]> {
  return executeWithFallback(
    async () => {
      const url = productId ? `/products/${productId}/reviews` : '/reviews';
      const res = await apiClient.get<ProductReview[]>(url);
      return res.data;
    },
    () => (productId ? mockDb.getReviewsByProduct(productId) : mockDb.getReviews())
  );
}

export async function moderateReview(reviewId: number, isApproved: boolean): Promise<ProductReview> {
  return executeWithFallback(
    async () => {
      const res = await apiClient.put<ProductReview>(`/reviews/${reviewId}/moderation`, { isApproved });
      return res.data;
    },
    () => mockDb.moderateReview(reviewId, isApproved)
  );
}
