package com.dfine.oms.module2_product.dto;

import java.math.BigDecimal;

// DTO record representing variant SKU details and stock status
public record VariantDto(
    Integer variantId,
    String sku,
    String size,
    String color,
    BigDecimal priceAdjustment,
    int stockQuantity,
    int lowStockThreshold,
    String stockStatus
) {}
