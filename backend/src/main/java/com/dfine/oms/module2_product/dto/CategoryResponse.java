package com.dfine.oms.module2_product.dto;

// Data Transfer Object for returning category data to apis (like structs in C)
public record CategoryResponse(
        Integer categoryId,
        String categoryName,
        String description) {
}
