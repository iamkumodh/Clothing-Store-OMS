/**
 * Product & Catalog REST API Client
 */

import { apiClient } from './client';
import { BackendProductResponse, mapBackendProductToDfineProduct } from './adapter';
import { Product } from '../components/common/types';
import { dfineProducts } from '../components/common/data';
import { dfineCollectionProducts } from '../components/common/collection-data';

export async function fetchProducts(params?: {
  categoryId?: number;
  gender?: string;
}): Promise<Product[]> {
  try {
    const res = await apiClient.get<BackendProductResponse[]>('/products', { params });
    if (res.data && Array.isArray(res.data) && res.data.length > 0) {
      return res.data.map(mapBackendProductToDfineProduct);
    }
  } catch (error) {
    console.info('Spring Boot backend offline or unreachable. Using local catalog.', error);
  }
  return dfineCollectionProducts;
}

export async function fetchProductById(idOrHandle: string | number): Promise<Product> {
  const allMocks = [...dfineProducts, ...dfineCollectionProducts];
  const numId = Number(idOrHandle);

  if (!isNaN(numId) && numId > 0) {
    try {
      const res = await apiClient.get<BackendProductResponse>(`/products/${numId}`);
      if (res.data && res.data.productId) {
        return mapBackendProductToDfineProduct(res.data);
      }
    } catch (error) {
      console.info(`Backend fetch failed for id ${numId}, falling back to mock catalog.`, error);
    }
  }

  // Fallback lookup by id or handle
  return (
    allMocks.find(p => p.handle === String(idOrHandle)) ||
    allMocks.find(p => p.id === String(idOrHandle)) ||
    allMocks[0]
  );
}

export async function submitProductReview(
  productId: number,
  review: { customerName: string; rating: number; reviewComment: string }
): Promise<boolean> {
  try {
    await apiClient.post(`/products/${productId}/reviews`, review);
    return true;
  } catch (err) {
    console.info('Backend review submission failed, mocked locally.', err);
    return false;
  }
}
