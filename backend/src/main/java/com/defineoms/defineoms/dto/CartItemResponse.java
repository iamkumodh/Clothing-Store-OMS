package com.defineoms.defineoms.dto;

   public class CartItemResponse {
        private Integer variantId;
        private Integer quantity;

        // Default constructor
        public CartItemResponse() {
        }

        public CartItemResponse(Integer variantId, Integer quantity) {
            this.variantId = variantId;
            this.quantity = quantity;
        }

        // Getters and Setters
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

