package com.dfine.oms.module4_payment.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

// Stores bank slip deposit details.
// Extends Payment so it inherits paymentId, orderId, amount, and paymentStatus.
@Entity
@Table(name = "bank_transfer_payment")
@PrimaryKeyJoinColumn(name = "payment_id")
public class BankTransferPayment extends Payment {

    @Column(name = "verified_by_staff_id")
    private Integer verifiedByStaffId;

    @Column(name = "bank_name", nullable = false, length = 100)
    private String bankName;

    @Column(name = "deposit_reference", length = 100)
    private String depositReference;

    @Column(name = "slip_image_url", nullable = false, length = 255)
    private String slipImageUrl;

    @Column(name = "rejection_reason", columnDefinition = "TEXT")
    private String rejectionReason;

    @Column(name = "verified_at")
    private LocalDateTime verifiedAt;

    public BankTransferPayment() {
        super();
        setPaymentMethod("BANK_TRANSFER");
    }

    public BankTransferPayment(Integer orderId, BigDecimal amount, String bankName, String depositReference, String slipImageUrl) {
        super(orderId, amount, "BANK_TRANSFER", "PENDING");
        this.bankName = bankName;
        this.depositReference = depositReference;
        this.slipImageUrl = slipImageUrl;
    }

    // Helper method to quickly check if the slip was already approved by a staff member
    @Transient
    public boolean isSlipVerified() {
        return verifiedAt != null && verifiedByStaffId != null;
    }

    public Integer getVerifiedByStaffId() {
        return verifiedByStaffId;
    }

    public void setVerifiedByStaffId(Integer verifiedByStaffId) {
        this.verifiedByStaffId = verifiedByStaffId;
    }

    public String getBankName() {
        return bankName;
    }

    public void setBankName(String bankName) {
        this.bankName = bankName;
    }

    public String getDepositReference() {
        return depositReference;
    }

    public void setDepositReference(String depositReference) {
        this.depositReference = depositReference;
    }

    public String getSlipImageUrl() {
        return slipImageUrl;
    }

    public void setSlipImageUrl(String slipImageUrl) {
        this.slipImageUrl = slipImageUrl;
    }

    public String getRejectionReason() {
        return rejectionReason;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }

    public LocalDateTime getVerifiedAt() {
        return verifiedAt;
    }

    public void setVerifiedAt(LocalDateTime verifiedAt) {
        this.verifiedAt = verifiedAt;
    }
}
