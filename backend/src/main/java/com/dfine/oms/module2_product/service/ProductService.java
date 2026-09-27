package com.dfine.oms.module2_product.service;

import com.dfine.oms.module2_product.dto.CreateProductRequest;
import com.dfine.oms.module2_product.dto.ProductResponse;

import java.util.List;

// interface for product catalog operations
public interface ProductService {

    List<ProductResponse> getAllProducts(Integer categoryId, String gender);

    ProductResponse getProductById(Integer productId);

    ProductResponse createProduct(CreateProductRequest request);
}
