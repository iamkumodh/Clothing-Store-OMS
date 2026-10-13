package com.dfine.oms.module4_payment.dto;

import jakarta.validation.constraints.DecimalMin;
import java.math.BigDecimal;
import java.time.LocalDateTime;

// DTO used when courier reconciles and remits cash collected from COD deliveries.
public record CodSettleRequest(
        // Status: COLLECTED_BY_COURIER or REMITTED_TO_STORE
        String cashCollectionStatus,

        @DecimalMin(value = "0.0", inclusive = true, message = "Collected amount cannot be negative")
        BigDecimal collectedAmount,

        LocalDateTime courierRemittanceDate
) {}
