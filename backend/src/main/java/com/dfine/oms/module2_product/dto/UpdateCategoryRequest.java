package com.dfine.oms.module2_product.dto;

// request body for updating category details
public record UpdateCategoryRequest(
    String categoryName,
    String description
) {}
