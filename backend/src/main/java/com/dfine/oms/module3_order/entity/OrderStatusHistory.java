package com.dfine.oms.module3_order.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "order_status_history")
public class OrderStatusHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer historyId;

    private Integer orderId;
    private Integer changedByUserId;
    private String previousStatus;
    private String newStatus;
    private LocalDateTime changedAt;
    private String notes;

    public OrderStatusHistory() {}

    public Integer getHistoryId() {
        return historyId;
    }
    public void setHistoryId(Integer historyId) {
        this.historyId = historyId;
    }

    public Integer getOrderId() {
        return orderId;
    }
    public void setOrderId(Integer orderId) {
        this.orderId = orderId;
    }

    public Integer getChangedByUserId() {
        return changedByUserId;
    }
    public void setChangedByUserId(Integer changedByUserId) {
        this.changedByUserId = changedByUserId;
    }

    public String getPreviousStatus() {
        return previousStatus;
    }
    public void setPreviousStatus(String previousStatus) {
        this.previousStatus = previousStatus;
    }

    public String getNewStatus() {
        return newStatus;
    }
    public void setNewStatus(String newStatus) {
        this.newStatus = newStatus;
    }

    public LocalDateTime getChangedAt() {
        return changedAt;
    }
    public void setChangedAt(LocalDateTime changedAt) {
        this.changedAt = changedAt;
    }

    public String getNotes() {
        return notes;
    }
    public void setNotes(String notes) {
        this.notes = notes;
    }
}
