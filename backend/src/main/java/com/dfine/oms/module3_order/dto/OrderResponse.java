package com.dfine.oms.module3_order.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class OrderResponse {

    private Integer orderId;
    private String orderNumber;
    private Integer customerId;
    private LocalDateTime orderDate;
    private String orderStatus;
    private BigDecimal subtotalAmount;
    private BigDecimal shippingFee;
    private BigDecimal courierCharge;
    private BigDecimal totalAmount;
    private BigDecimal totalPayable;
    private String paymentMethod;
    private String shippingAddress;
    private String shippingAddressSnapshot;
    private String recipientName;
    private String customerName;
    private String recipientPhone;
    private String customerPhone;
    private List<OrderItemResponse> items = new ArrayList<>();

    public OrderResponse() {}

    public OrderResponse(Integer orderId, String orderNumber, String orderStatus,
                         BigDecimal totalPayable, List<OrderItemResponse> items) {
        this.orderId = orderId;
        this.orderNumber = orderNumber;
        this.orderStatus = orderStatus;
        this.totalPayable = totalPayable;
        this.totalAmount = totalPayable;
        this.items = items;
    }

    public Integer getOrderId() { return orderId; }
    public void setOrderId(Integer orderId) { this.orderId = orderId; }

    public String getOrderNumber() { return orderNumber; }
    public void setOrderNumber(String orderNumber) { this.orderNumber = orderNumber; }

    public Integer getCustomerId() { return customerId; }
    public void setCustomerId(Integer customerId) { this.customerId = customerId; }

    public LocalDateTime getOrderDate() { return orderDate; }
    public void setOrderDate(LocalDateTime orderDate) { this.orderDate = orderDate; }

    public String getOrderStatus() { return orderStatus; }
    public void setOrderStatus(String orderStatus) { this.orderStatus = orderStatus; }

    public BigDecimal getSubtotalAmount() { return subtotalAmount; }
    public void setSubtotalAmount(BigDecimal subtotalAmount) { this.subtotalAmount = subtotalAmount; }

    public BigDecimal getShippingFee() { return shippingFee; }
    public void setShippingFee(BigDecimal shippingFee) {
        this.shippingFee = shippingFee;
        this.courierCharge = shippingFee;
    }

    public BigDecimal getCourierCharge() { return courierCharge; }
    public void setCourierCharge(BigDecimal courierCharge) {
        this.courierCharge = courierCharge;
        this.shippingFee = courierCharge;
    }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
        this.totalPayable = totalAmount;
    }

    public BigDecimal getTotalPayable() { return totalPayable; }
    public void setTotalPayable(BigDecimal totalPayable) {
        this.totalPayable = totalPayable;
        this.totalAmount = totalPayable;
    }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getShippingAddress() { return shippingAddress; }
    public void setShippingAddress(String shippingAddress) {
        this.shippingAddress = shippingAddress;
        this.shippingAddressSnapshot = shippingAddress;
    }

    public String getShippingAddressSnapshot() { return shippingAddressSnapshot; }
    public void setShippingAddressSnapshot(String shippingAddressSnapshot) {
        this.shippingAddressSnapshot = shippingAddressSnapshot;
        this.shippingAddress = shippingAddressSnapshot;
    }

    public String getRecipientName() { return recipientName; }
    public void setRecipientName(String recipientName) {
        this.recipientName = recipientName;
        this.customerName = recipientName;
    }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) {
        this.customerName = customerName;
        this.recipientName = customerName;
    }

    public String getRecipientPhone() { return recipientPhone; }
    public void setRecipientPhone(String recipientPhone) {
        this.recipientPhone = recipientPhone;
        this.customerPhone = recipientPhone;
    }

    public String getCustomerPhone() { return customerPhone; }
    public void setCustomerPhone(String customerPhone) {
        this.customerPhone = customerPhone;
        this.recipientPhone = customerPhone;
    }

    public List<OrderItemResponse> getItems() { return items; }
    public void setItems(List<OrderItemResponse> items) { this.items = items; }

    // Nested static classes to avoid creating new files
    public static class CheckoutRequest {
        private Integer cartId;
        private Integer customerId;
        private String customerName;
        private String customerEmail;
        private String customerPhone;
        private String shippingAddress;
        private String shippingCity;
        private String shippingDistrict;
        private String shippingProvince;
        private Integer courierPartnerId;
        private String paymentMethod;
        private String notes;
        private List<CheckoutItem> items;

        public CheckoutRequest() {}

        public Integer getCartId() { return cartId; }
        public void setCartId(Integer cartId) { this.cartId = cartId; }

        public Integer getCustomerId() { return customerId; }
        public void setCustomerId(Integer customerId) { this.customerId = customerId; }

        public String getCustomerName() { return customerName; }
        public void setCustomerName(String customerName) { this.customerName = customerName; }

        public String getCustomerEmail() { return customerEmail; }
        public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }

        public String getCustomerPhone() { return customerPhone; }
        public void setCustomerPhone(String customerPhone) { this.customerPhone = customerPhone; }

        public String getShippingAddress() { return shippingAddress; }
        public void setShippingAddress(String shippingAddress) { this.shippingAddress = shippingAddress; }

        public String getShippingCity() { return shippingCity; }
        public void setShippingCity(String shippingCity) { this.shippingCity = shippingCity; }

        public String getShippingDistrict() { return shippingDistrict; }
        public void setShippingDistrict(String shippingDistrict) { this.shippingDistrict = shippingDistrict; }

        public String getShippingProvince() { return shippingProvince; }
        public void setShippingProvince(String shippingProvince) { this.shippingProvince = shippingProvince; }

        public Integer getCourierPartnerId() { return courierPartnerId; }
        public void setCourierPartnerId(Integer courierPartnerId) { this.courierPartnerId = courierPartnerId; }

        public String getPaymentMethod() { return paymentMethod; }
        public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

        public String getNotes() { return notes; }
        public void setNotes(String notes) { this.notes = notes; }

        public List<CheckoutItem> getItems() { return items; }
        public void setItems(List<CheckoutItem> items) { this.items = items; }
    }

    public static class CheckoutItem {
        private String productId;
        private String productTitle;
        private Integer variantId;
        private String size;
        private String color;
        private Integer quantity;
        private BigDecimal unitPrice;
        private String image;

        public CheckoutItem() {}

        public CheckoutItem(String productId, String productTitle, Integer variantId,
                            String size, String color, Integer quantity,
                            BigDecimal unitPrice, String image) {
            this.productId = productId;
            this.productTitle = productTitle;
            this.variantId = variantId;
            this.size = size;
            this.color = color;
            this.quantity = quantity;
            this.unitPrice = unitPrice;
            this.image = image;
        }

        public String getProductId() { return productId; }
        public void setProductId(String productId) { this.productId = productId; }

        public String getProductTitle() { return productTitle; }
        public void setProductTitle(String productTitle) { this.productTitle = productTitle; }

        public Integer getVariantId() { return variantId; }
        public void setVariantId(Integer variantId) { this.variantId = variantId; }

        public String getSize() { return size; }
        public void setSize(String size) { this.size = size; }

        public String getColor() { return color; }
        public void setColor(String color) { this.color = color; }

        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }

        public BigDecimal getUnitPrice() { return unitPrice; }
        public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }

        public String getImage() { return image; }
        public void setImage(String image) { this.image = image; }
    }
}
