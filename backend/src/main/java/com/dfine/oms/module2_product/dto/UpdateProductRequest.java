package com.dfine.oms.module2_product.dto;

import java.math.BigDecimal;

// request body for updating catalog product details
public record UpdateProductRequest(
    String productName,
    String description,
    String genderTarget,
    BigDecimal basePrice,
    String mainImageUrl,
    Integer categoryId,
    Boolean isActive
) {}
