package com.dfine.oms.module2_product.dto;

import java.math.BigDecimal;

// request body for adding a new variant to a product
public record CreateVariantRequest(
    String sku,
    String size,
    String color,
    BigDecimal priceAdjustment,
    int initialStock,
    int lowStockThreshold
) {}
