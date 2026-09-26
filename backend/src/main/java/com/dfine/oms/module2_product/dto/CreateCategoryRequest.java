package com.dfine.oms.module2_product.dto;

// request body payload for creating a new category
public record CreateCategoryRequest(
    String categoryName,
    String description
) {}
