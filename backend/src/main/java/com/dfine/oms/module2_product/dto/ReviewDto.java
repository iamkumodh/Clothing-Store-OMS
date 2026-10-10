package com.dfine.oms.module2_product.dto;

import java.time.LocalDateTime;

public record ReviewDto(
    Integer reviewId,
    Integer customerId,
    short rating,
    String comment,
    LocalDateTime createdAt
) {}
