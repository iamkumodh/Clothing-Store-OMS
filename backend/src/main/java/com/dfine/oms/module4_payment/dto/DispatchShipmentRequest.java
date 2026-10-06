package com.dfine.oms.module4_payment.dto;

import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

// DTO used by store staff to hand over an order to a courier and generate tracking.
public record DispatchShipmentRequest(
        @NotNull(message = "Order ID is required")
        Integer orderId,

        @NotNull(message = "Courier ID is required")
        Integer courierId,

        // Optional custom tracking number, auto-generated if omitted
        String trackingNumber,

        BigDecimal courierCharge,

        Integer staffUserId,

        String initialLocation
) {}
