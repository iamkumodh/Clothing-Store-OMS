package com.dfine.oms.module4_payment.dto;

import jakarta.validation.constraints.NotNull;

// DTO used by store staff to approve or reject a customer's bank deposit slip.
public record VerifySlipRequest(
        @NotNull(message = "Staff ID is required")
        Integer staffId,

        // True if the slip is approved, false if rejected
        Boolean approved,

        // Optional explanation from staff if the deposit slip is rejected
        String rejectionReason
) {
    public boolean isApproved() {
        return approved == null || Boolean.TRUE.equals(approved);
    }
}
