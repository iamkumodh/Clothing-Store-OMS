package com.dfine.oms.module4_payment.dto;

import jakarta.validation.constraints.NotBlank;

// Request sent by customer to submit a bank transfer deposit receipt.
public record SubmitBankTransferRequest(
        Integer paymentId,
        Integer orderId,

        @NotBlank(message = "Bank name is required")
        String bankName,

        String depositReference,

        String slipImageUrl,
        String slipImageBase64
) {
    // Convenient constructor overload for 4-argument calls
    public SubmitBankTransferRequest(Integer paymentId, String bankName, String depositReference, String slipImageUrl) {
        this(paymentId, null, bankName, depositReference, slipImageUrl, null);
    }

    // Resolves slip image URL whether sent as image URL or base64 string
    public String resolveSlipUrl() {
        if (slipImageUrl != null && !slipImageUrl.isBlank()) {
            return slipImageUrl;
        }
        if (slipImageBase64 != null && !slipImageBase64.isBlank()) {
            return slipImageBase64;
        }
        return "https://cdn.dfine.store/slips/placeholder_slip.png";
    }
}
