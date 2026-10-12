package com.dfine.oms.module2_product.dto;

// general restock request payload containing variant id
public record GeneralRestockRequest(
    Integer variantId,
    Integer staffId,
    int quantityAdded,
    String notes
) {}
