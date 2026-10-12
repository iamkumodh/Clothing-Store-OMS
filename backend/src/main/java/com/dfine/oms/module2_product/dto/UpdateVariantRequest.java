package com.dfine.oms.module2_product.dto;

import java.math.BigDecimal;

// Request body used by staff to update an existing variant's details or stock
public record UpdateVariantRequest(
    String sku,
    String size,
    String color,
    BigDecimal priceAdjustment,
    Integer stockQuantity,
    Integer lowStockThreshold,
    String variantImageUrl
) {}
