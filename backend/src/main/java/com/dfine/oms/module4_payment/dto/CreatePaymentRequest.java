package com.dfine.oms.module4_payment.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

// DTO used when creating a payment record after placing an order.
public record CreatePaymentRequest(
        @NotNull(message = "Order ID is required")
        Integer orderId,

        @NotNull(message = "Payment amount is required")
        @DecimalMin(value = "0.0", inclusive = true, message = "Amount cannot be negative")
        BigDecimal amount,

        // Payment method: BANK_TRANSFER or CASH_ON_DELIVERY
        @NotBlank(message = "Payment method is required")
        String paymentMethod,

        // Optional initial bank details if customer provides them during checkout
        String bankName,
        String depositReference,
        String slipImageUrl
) {}
