package com.dfine.oms.module4_payment.dto;

import java.math.BigDecimal;

public class CodDTO {

    private Integer paymentId;
    private BigDecimal collectedAmount;
    private String cashCollectionStatus;

    public CodDTO() {
    }

    public Integer getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(Integer paymentId) {
        this.paymentId = paymentId;
    }

    public BigDecimal getCollectedAmount() {
        return collectedAmount;
    }

    public void setCollectedAmount(BigDecimal collectedAmount) {
        this.collectedAmount = collectedAmount;
    }

    public String getCashCollectionStatus() {
        return cashCollectionStatus;
    }

    public void setCashCollectionStatus(String cashCollectionStatus) {
        this.cashCollectionStatus = cashCollectionStatus;
    }
}
