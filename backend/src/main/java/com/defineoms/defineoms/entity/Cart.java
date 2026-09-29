package com.defineoms.defineoms.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "cart")
public class Cart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer cartId;

    private Integer customerId;      // nullable, guest checkout
    private String guestToken;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // temporary helper methods for initial testing
    @Transient
    private List<CartItem> temporaryItems = new ArrayList<>();

    public Cart() {}

    public void addTempItem(CartItem item) {
        this.temporaryItems.add(item);
    }

    public List<CartItem> getTemporaryItems() {
        return this.temporaryItems;
    }

    public int getItemCount() {
        return this.temporaryItems.size();
    }

    public void clearTempItems() {
        this.temporaryItems.clear();
    }

    // --- getters and setters ---
    public Integer getCartId() { return cartId; }
    public void setCartId(Integer cartId) { this.cartId = cartId; }

    public Integer getCustomerId() { return customerId; }
    public void setCustomerId(Integer customerId) { this.customerId = customerId; }

    public String getGuestToken() { return guestToken; }
    public void setGuestToken(String guestToken) { this.guestToken = guestToken; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
