package com.dfine.oms.module4_payment.dto;

import java.math.BigDecimal;

public class PaymentDTO {

    private Integer orderId;
    private BigDecimal amount;
    private String paymentMethod;

    public PaymentDTO() {
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
}
