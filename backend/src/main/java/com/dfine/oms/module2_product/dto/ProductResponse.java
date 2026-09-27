package com.dfine.oms.module2_product.dto;

import java.math.BigDecimal;

// DTO record representing product catalog item
public record ProductResponse(
    Integer productId,
    Integer categoryId,
    String categoryName,
    String productName,
    String description,
    String genderTarget,
    BigDecimal basePrice,
    String mainImageUrl,
    boolean isActive
) {}
