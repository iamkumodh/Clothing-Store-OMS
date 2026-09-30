package com.dfine.oms.module4_payment.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

// Represents a delivery shipment dispatch record assigned to a courier partner.
@Entity
@Table(name = "delivery_shipment")
public class DeliveryShipment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "delivery_id")
    private Integer deliveryId;

    @Column(name = "order_id", nullable = false, unique = true)
    private Integer orderId;

    @Column(name = "courier_id", nullable = false)
    private Integer courierId;

    @Column(name = "tracking_number", nullable = false, unique = true, length = 100)
    private String trackingNumber;

    @Column(name = "courier_charge", nullable = false, precision = 10, scale = 2)
    private BigDecimal courierCharge;

    // Delivery status: PENDING, DISPATCHED, IN_TRANSIT, OUT_FOR_DELIVERY, DELIVERED, RETURNED, FAILED
    @Column(name = "delivery_status", length = 30)
    private String deliveryStatus = "PENDING";

    @Column(name = "current_location", length = 255)
    private String currentLocation;

    @Column(name = "dispatched_at")
    private LocalDateTime dispatchedAt;

    @Column(name = "delivered_at")
    private LocalDateTime deliveredAt;

    public DeliveryShipment() {
    }

    public DeliveryShipment(Integer orderId, Integer courierId, String trackingNumber, BigDecimal courierCharge) {
        this.orderId = orderId;
        this.courierId = courierId;
        this.trackingNumber = trackingNumber;
        this.courierCharge = courierCharge;
        this.deliveryStatus = "DISPATCHED";
        this.dispatchedAt = LocalDateTime.now();
    }

    public Integer getDeliveryId() {
        return deliveryId;
    }

    public void setDeliveryId(Integer deliveryId) {
        this.deliveryId = deliveryId;
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

    // Alias getter and setter so existing code looking for shippingFee still works cleanly
    public BigDecimal getShippingFee() {
        return courierCharge;
    }

    public void setShippingFee(BigDecimal shippingFee) {
        this.courierCharge = shippingFee;
    }

    public String getDeliveryStatus() {
        return deliveryStatus;
    }

    public void setDeliveryStatus(String deliveryStatus) {
        this.deliveryStatus = deliveryStatus;
    }

    public String getCurrentLocation() {
        return currentLocation;
    }

    public void setCurrentLocation(String currentLocation) {
        this.currentLocation = currentLocation;
    }

    public LocalDateTime getDispatchedAt() {
        return dispatchedAt;
    }

    public void setDispatchedAt(LocalDateTime dispatchedAt) {
        this.dispatchedAt = dispatchedAt;
    }

    public LocalDateTime getDeliveredAt() {
        return deliveredAt;
    }

    public void setDeliveredAt(LocalDateTime deliveredAt) {
        this.deliveredAt = deliveredAt;
    }
}
