package com.dfine.oms.module2_product.dto;

import java.math.BigDecimal;

// request payload for adding a new product to catalog
public record CreateProductRequest(
    Integer categoryId,
    String productName,
    String description,
    String genderTarget,
    BigDecimal basePrice,
    String mainImageUrl
) {}
