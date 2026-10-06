package com.dfine.oms.module4_payment.dto;

import jakarta.validation.constraints.NotBlank;

// DTO used to update checkpoint location and delivery lifecycle status.
public record UpdateShipmentStatusRequest(
        // Status: IN_TRANSIT, OUT_FOR_DELIVERY, DELIVERED, RETURNED, FAILED
        @NotBlank(message = "Delivery status is required")
        String deliveryStatus,

        String currentLocation,

        Integer staffUserId
) {}
