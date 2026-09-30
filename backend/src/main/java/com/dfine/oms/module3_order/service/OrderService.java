package com.dfine.oms.module3_order.service;

// Service interface for cross-module order status synchronization
public interface OrderService {
    void updateStatus(Integer orderId, String newStatus, Integer changedByUserId, String note);
}
