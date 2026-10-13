package com.dfine.oms.module3_order.service;

import com.dfine.oms.module3_order.dto.OrderResponse;
import com.dfine.oms.module3_order.entity.CustomerOrder;
import com.dfine.oms.module3_order.entity.OrderItem;
import com.dfine.oms.module3_order.entity.OrderStatusHistory;

import java.util.List;

// Service interface managing cart checkout, order lifecycle, and cross-module status synchronization
public interface OrderService {

    OrderResponse checkoutJson(OrderResponse.CheckoutRequest request);

    CustomerOrder checkout(Integer cartId, Integer customerId,
                          String customerName, String customerEmail,
                          String customerPhone, String shippingAddress,
                          String shippingDistrict, String shippingProvince);

    List<CustomerOrder> getOrderHistory(Integer customerId);

    List<OrderItem> getOrderItems(Integer orderId);

    List<OrderStatusHistory> getStatusHistory(Integer orderId);

    CustomerOrder updateStatus(Integer orderId, String newStatus, Integer changedByUserId, String note);

    OrderResponse buildOrderResponse(Integer orderId);

    OrderResponse getOrderByIdOrNumber(String idOrNumber);

    List<CustomerOrder> getAllOrders();
}
