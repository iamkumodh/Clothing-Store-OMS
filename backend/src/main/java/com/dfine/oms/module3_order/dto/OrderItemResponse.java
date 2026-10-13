package com.dfine.oms.module3_order.dto;

import java.math.BigDecimal;

public class OrderItemResponse {

    private Integer orderItemId;
    private Integer variantId;
    private String productTitle;
    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal subtotal;
    private String customImageUrl;

    public OrderItemResponse() {}

    public OrderItemResponse(Integer orderItemId, Integer variantId, Integer quantity,
                             BigDecimal unitPrice, BigDecimal subtotal) {
        this.orderItemId = orderItemId;
        this.variantId = variantId;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.subtotal = subtotal;
    }

    public OrderItemResponse(Integer orderItemId, Integer variantId, String productTitle,
                             Integer quantity, BigDecimal unitPrice, BigDecimal subtotal,
                             String customImageUrl) {
        this.orderItemId = orderItemId;
        this.variantId = variantId;
        this.productTitle = productTitle;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.subtotal = subtotal;
        this.customImageUrl = customImageUrl;
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

    public String getProductTitle() {
        return productTitle;
    }
    public void setProductTitle(String productTitle) {
        this.productTitle = productTitle;
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

    public String getCustomImageUrl() {
        return customImageUrl;
    }
    public void setCustomImageUrl(String customImageUrl) {
        this.customImageUrl = customImageUrl;
    }
}
