package com.defineoms.defineoms.dto;

import java.math.BigDecimal;

public class OrderItemResponse {

    private Integer orderItemId;
    private Integer variantId;
    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal subtotal;

    public OrderItemResponse() {
    }

    public OrderItemResponse(Integer orderItemId, Integer variantId, Integer quantity,
                             BigDecimal unitPrice, BigDecimal subtotal) {
        this.orderItemId = orderItemId;
        this.variantId = variantId;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.subtotal = subtotal;
    }

    public Integer getOrderItemId() {
        return orderItemId;
    }
    public void setOrderItemId(Integer orderItemId) {
        this.orderItemId = orderItemId;
    }

    public Integer getVariantId() {
        return variantId;
    }
    public void setVariantId(Integer variantId) {
        this.variantId = variantId;
    }

    public Integer getQuantity() {
        return quantity;
    }
    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getUnitPrice() {
        return unitPrice;
    }
    public void setUnitPrice(BigDecimal unitPrice) {
        this.unitPrice = unitPrice;
    }

    public BigDecimal getSubtotal() {
        return subtotal;
    }
    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
    }
}
