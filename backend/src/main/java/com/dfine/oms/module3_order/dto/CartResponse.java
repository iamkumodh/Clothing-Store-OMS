package com.dfine.oms.module3_order.dto;

public class CartResponse {
    private Integer cartId;
    private Integer customerId;
    private Double totalPrice;
    private String message;

    public CartResponse() {}

    public CartResponse(Integer cartId, Integer customerId, Double totalPrice, String message) {
        this.cartId = cartId;
        this.customerId = customerId;
        this.totalPrice = totalPrice;
        this.message = message;
    }

    public Integer getCartId() {
        return cartId;
    }
    public void setCartId(Integer cartId) {
        this.cartId = cartId;
    }

    public Integer getCustomerId() {
        return customerId;
    }
    public void setCustomerId(Integer customerId) {
        this.customerId = customerId;
    }

    public Double getTotalPrice() {
        return totalPrice;
    }
    public void setTotalPrice(Double totalPrice) {
        this.totalPrice = totalPrice;
    }

    public String getMessage() {
        return message;
    }
    public void setMessage(String message) {
        this.message = message;
    }
}
