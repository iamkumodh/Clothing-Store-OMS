package com.dfine.oms.module4_payment.dto;

import java.math.BigDecimal;

public class DeliveryDTO {

    private Integer orderId;
    private Integer courierId;
    private String trackingNumber;
    private BigDecimal courierCharge;

    public DeliveryDTO() {
    }

    public Integer getOrderId() {
        return orderId;
    }

    public void setOrderId(Integer orderId) {
        this.orderId = orderId;
    }

    public Integer getCourierId() {
        return courierId;
    }

    public void setCourierId(Integer courierId) {
        this.courierId = courierId;
    }

    public String getTrackingNumber() {
        return trackingNumber;
    }

    public void setTrackingNumber(String trackingNumber) {
        this.trackingNumber = trackingNumber;
    }

    public BigDecimal getCourierCharge() {
        return courierCharge;
    }

    public void setCourierCharge(BigDecimal courierCharge) {
        this.courierCharge = courierCharge;
    }

    public BigDecimal getShippingFee() {
        return courierCharge;
    }

    public void setShippingFee(BigDecimal shippingFee) {
        this.courierCharge = shippingFee;
    }
}
