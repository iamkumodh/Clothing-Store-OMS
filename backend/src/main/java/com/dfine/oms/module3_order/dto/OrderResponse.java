package com.dfine.oms.module3_order.dto;

import java.math.BigDecimal;
import java.util.List;

public class OrderResponse {

    private Integer orderId;
    private String orderNumber;
    private String orderStatus;
    private BigDecimal totalPayable;
    private List<OrderItemResponse> items;

    public OrderResponse() {}

    public OrderResponse(Integer orderId, String orderNumber, String orderStatus,
                         BigDecimal totalPayable, List<OrderItemResponse> items) {
        this.orderId = orderId;
        this.orderNumber = orderNumber;
        this.orderStatus = orderStatus;
        this.totalPayable = totalPayable;
        this.items = items;
    }

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

    public String getOrderStatus() {
        return orderStatus;
    }
    public void setOrderStatus(String orderStatus) {
        this.orderStatus = orderStatus;
    }

    public BigDecimal getTotalPayable() {
        return totalPayable;
    }
    public void setTotalPayable(BigDecimal totalPayable) {
        this.totalPayable = totalPayable;
    }

    public List<OrderItemResponse> getItems() {
        return items;
    }
    public void setItems(List<OrderItemResponse> items) {
        this.items = items;
    }
}
