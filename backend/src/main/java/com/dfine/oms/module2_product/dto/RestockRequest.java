package com.dfine.oms.module2_product.dto;

// payload for restocking a specific variant by url id
public record RestockRequest(
    Integer staffId,
    int quantityAdded,
    String notes
) {}
