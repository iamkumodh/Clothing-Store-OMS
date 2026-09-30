package com.dfine.oms.module4_payment.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

// Stores Cash On Delivery payment tracking and courier remittance information.
// Extends Payment so it joins with the parent payment table on payment_id.
@Entity
@Table(name = "cash_on_delivery_payment")
@PrimaryKeyJoinColumn(name = "payment_id")
public class CashOnDeliveryPayment extends Payment {

    // Status: UNCOLLECTED, COLLECTED_BY_COURIER, REMITTED_TO_STORE
    @Column(name = "cash_collection_status", length = 20)
    private String cashCollectionStatus = "UNCOLLECTED";

    @Column(name = "collected_amount", precision = 10, scale = 2)
    private BigDecimal collectedAmount;

    @Column(name = "courier_remittance_date")
    private LocalDateTime courierRemittanceDate;

    public CashOnDeliveryPayment() {
        super();
        setPaymentMethod("CASH_ON_DELIVERY");
    }

    public CashOnDeliveryPayment(Integer orderId, BigDecimal amount) {
        super(orderId, amount, "CASH_ON_DELIVERY", "PENDING");
        this.cashCollectionStatus = "UNCOLLECTED";
    }

    public String getCashCollectionStatus() {
        return cashCollectionStatus;
    }

    public void setCashCollectionStatus(String cashCollectionStatus) {
        this.cashCollectionStatus = cashCollectionStatus;
    }

    public BigDecimal getCollectedAmount() {
        return collectedAmount;
    }

    public void setCollectedAmount(BigDecimal collectedAmount) {
        this.collectedAmount = collectedAmount;
    }

    public LocalDateTime getCourierRemittanceDate() {
        return courierRemittanceDate;
    }

    public void setCourierRemittanceDate(LocalDateTime courierRemittanceDate) {
        this.courierRemittanceDate = courierRemittanceDate;
    }
}
