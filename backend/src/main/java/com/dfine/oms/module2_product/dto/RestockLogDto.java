package com.dfine.oms.module2_product.dto;

import java.time.LocalDateTime;

// DTO record representing restock audit history entry
public record RestockLogDto(
    Integer restockId,
    Integer variantId,
    String sku,
    Integer receivedByStaffId,
    int quantityAdded,
    LocalDateTime restockedAt,
    String notes
) {}
