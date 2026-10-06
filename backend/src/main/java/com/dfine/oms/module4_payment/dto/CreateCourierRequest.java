package com.dfine.oms.module4_payment.dto;

import jakarta.validation.constraints.NotBlank;

// DTO used to register a new courier delivery partner.
public record CreateCourierRequest(
        @NotBlank(message = "Courier name is required")
        String courierName,

        @NotBlank(message = "Contact number is required")
        String contactNumber,

        @NotBlank(message = "Tracking API URL is required")
        String trackingApiUrl,

        Boolean isActive
) {}
