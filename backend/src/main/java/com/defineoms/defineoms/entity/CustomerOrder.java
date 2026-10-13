package com.defineoms.defineoms.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "customer_order")

public class CustomerOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer orderId;

    private String orderNumber;
    private Integer customerId;

    private Integer assistedByStaffId;

    private LocalDateTime orderDate;
    private String orderSource;
    private String orderStatus;

    private BigDecimal subtotalAmount;
    private BigDecimal shippingFee;
    private BigDecimal totalPayable;

    private String customerName;
    private String customerEmail;
    private String customerPhone;

    private String shippingAddressSnapshot;
    private String shippingDistrictSnapshot;
    private String shippingProvinceSnapshot;

    public CustomerOrder() {}

    public Integer getOrderId() {
        return orderId;
    }
    public void setOrderId(Integer orderId) {
        this.orderId = orderId;
    }

    public String getOrderNumber() {
        return orderNumber;
    }
    public void setOrderNumber(String orderNumber) {
        this.orderNumber = orderNumber;
    }

    public Integer getCustomerId() {
        return customerId;
    }
    public void setCustomerId(Integer customerId) {
        this.customerId = customerId;
    }

    public Integer getAssistedByStaffId() {
        return assistedByStaffId;
    }
    public void setAssistedByStaffId(Integer assistedByStaffId) {
        this.assistedByStaffId = assistedByStaffId;
    }

    public LocalDateTime getOrderDate() {
        return orderDate;
    }
    public void setOrderDate(LocalDateTime orderDate) {
        this.orderDate = orderDate;
    }

    public String getOrderSource() {
        return orderSource;
    }

    public void setOrderSource(String orderSource) {
        this.orderSource = orderSource;
    }

    public String getOrderStatus() {
        return orderStatus;
    }

    public void setOrderStatus(String orderStatus) {
        this.orderStatus = orderStatus;
    }

    public BigDecimal getSubtotalAmount() {
        return subtotalAmount;
    }
    public void setSubtotalAmount(BigDecimal subtotalAmount) {
        this.subtotalAmount = subtotalAmount;
    }

    public BigDecimal getShippingFee() {
        return shippingFee;
    }
    public void setShippingFee(BigDecimal shippingFee) {
        this.shippingFee = shippingFee;
    }

    public BigDecimal getTotalPayable() {
        return totalPayable;
    }
    public void setTotalPayable(BigDecimal totalPayable) {
        this.totalPayable = totalPayable;
    }

    public String getCustomerName() {
        return customerName;
    }
    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }
    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }

    public String getCustomerPhone() {
        return customerPhone;
    }
    public void setCustomerPhone(String customerPhone) {
        this.customerPhone = customerPhone;
    }

    public String getShippingAddressSnapshot() {
        return shippingAddressSnapshot;
    }
    public void setShippingAddressSnapshot(String v) {
        this.shippingAddressSnapshot = v;
    }

    public String getShippingDistrictSnapshot() {
        return shippingDistrictSnapshot;
    }
    public void setShippingDistrictSnapshot(String v) {
        this.shippingDistrictSnapshot = v;
    }

    public String getShippingProvinceSnapshot() {
        return shippingProvinceSnapshot;
    }
    public void setShippingProvinceSnapshot(String v) {
        this.shippingProvinceSnapshot = v;
    }
}

