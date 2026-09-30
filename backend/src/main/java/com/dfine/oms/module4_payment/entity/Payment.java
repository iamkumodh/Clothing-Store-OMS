package com.dfine.oms.module4_payment.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

// Base entity for all customer payments in the OMS.
// Uses JPA joined inheritance so child classes (BankTransferPayment, CashOnDeliveryPayment)
// share the payment_id primary key and link to their respective child tables.
@Entity
@Table(name = "payment")
@Inheritance(strategy = InheritanceType.JOINED)
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "payment_id")
    private Integer paymentId;

    @Column(name = "order_id", nullable = false)
    private Integer orderId;

    @Column(name = "amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    // Payment method can be BANK_TRANSFER or CASH_ON_DELIVERY
    @Column(name = "payment_method", nullable = false, length = 30)
    private String paymentMethod;

    // Status: PENDING, VERIFIED, REJECTED, COMPLETED, FAILED
    @Column(name = "payment_status", nullable = false, length = 20)
    private String paymentStatus = "PENDING";

    @Column(name = "payment_date")
    private LocalDateTime paymentDate;

    // Temporary helper methods for status checks
    @Transient
    public boolean isCompleted() {
        return "COMPLETED".equalsIgnoreCase(this.paymentStatus) || "VERIFIED".equalsIgnoreCase(this.paymentStatus);
    }

    @Transient
    public boolean isCashOnDelivery() {
        return "CASH_ON_DELIVERY".equalsIgnoreCase(this.paymentMethod);
    }

    public Payment() {
        this.paymentDate = LocalDateTime.now();
    }

    public Payment(Integer orderId, BigDecimal amount, String paymentMethod, String paymentStatus) {
        this.orderId = orderId;
        this.amount = amount;
        this.paymentMethod = paymentMethod;
        this.paymentStatus = paymentStatus != null ? paymentStatus : "PENDING";
        this.paymentDate = LocalDateTime.now();
    }

    public Integer getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(Integer paymentId) {
        this.paymentId = paymentId;
    }

    public Integer getOrderId() {
        return orderId;
    }

    public void setOrderId(Integer orderId) {
        this.orderId = orderId;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public LocalDateTime getPaymentDate() {
        return paymentDate;
    }

    public void setPaymentDate(LocalDateTime paymentDate) {
        this.paymentDate = paymentDate;
    }
}
