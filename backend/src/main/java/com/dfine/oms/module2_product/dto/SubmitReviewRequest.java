package com.dfine.oms.module2_product.dto;

public record SubmitReviewRequest(
    Integer customerId,
    int rating,
    String comment
) {}
