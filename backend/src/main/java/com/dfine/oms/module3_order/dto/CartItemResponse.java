package com.dfine.oms.module3_order.dto;

public class CartItemResponse {
    private Integer variantId;
    private Integer quantity;

    public CartItemResponse() {}

    public CartItemResponse(Integer variantId, Integer quantity) {
        this.variantId = variantId;
        this.quantity = quantity;
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
}
