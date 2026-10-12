package com.dfine.oms.module2_product.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

// RestockLog entity tracks every time store staff adds inventory stock
@Entity
@Table(name = "restock_log")
public class RestockLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "restock_id")
    private Integer restockId;

    // Foreign key to the restocked variant
    @ManyToOne
    @JoinColumn(name = "variant_id", nullable = false)
    private ProductVariant variant;

    @Column(name = "received_by_staff_id", nullable = false)
    private Integer receivedByStaffId;

    // Number of units added to inventory (must be > 0)
    @Column(name = "quantity_added", nullable = false)
    private int quantityAdded;

    // Date and time the restock transaction occurred
    @Column(name = "restocked_at")
    private LocalDateTime restockedAt = LocalDateTime.now();

    // Optional notes
    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    public RestockLog() {
    }

    public Integer getRestockId() {
        return this.restockId;
    }

    public void setRestockId(Integer restockId) {
        this.restockId = restockId;
    }

    public ProductVariant getVariant() {
        return this.variant;
    }

    public void setVariant(ProductVariant variant) {
        this.variant = variant;
    }

    public Integer getReceivedByStaffId() {
        return this.receivedByStaffId;
    }

    public void setReceivedByStaffId(Integer receivedByStaffId) {
        this.receivedByStaffId = receivedByStaffId;
    }

    public int getQuantityAdded() {
        return this.quantityAdded;
    }

    public void setQuantityAdded(int quantityAdded) {
        this.quantityAdded = quantityAdded;
    }

    public LocalDateTime getRestockedAt() {
        return this.restockedAt;
    }

    public void setRestockedAt(LocalDateTime restockedAt) {
        this.restockedAt = restockedAt;
    }

    public String getNotes() {
        return this.notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
