package com.dfine.oms.module3_order.controller;

import com.dfine.oms.module3_order.dto.OrderResponse;
import com.dfine.oms.module3_order.entity.CustomerOrder;
import com.dfine.oms.module3_order.entity.OrderItem;
import com.dfine.oms.module3_order.entity.OrderStatusHistory;
import com.dfine.oms.module3_order.service.OrderService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/checkout")
    public CustomerOrder checkout(@RequestParam Integer cartId,
                                  @RequestParam Integer customerId,
                                  @RequestParam String customerName,
                                  @RequestParam String customerEmail,
                                  @RequestParam String customerPhone,
                                  @RequestParam String shippingAddress,
                                  @RequestParam String shippingDistrict,
                                  @RequestParam String shippingProvince) {
        return orderService.checkout(cartId, customerId, customerName, customerEmail,
                customerPhone, shippingAddress, shippingDistrict, shippingProvince);
    }

    @GetMapping("/customer/{customerId}")
    public List<CustomerOrder> getOrderHistory(@PathVariable Integer customerId) {
        return orderService.getOrderHistory(customerId);
    }

    @GetMapping("/{orderId}/items")
    public List<OrderItem> getOrderItems(@PathVariable Integer orderId) {
        return orderService.getOrderItems(orderId);
    }

    @GetMapping("/{orderId}/history")
    public List<OrderStatusHistory> getStatusHistory(@PathVariable Integer orderId) {
        return orderService.getStatusHistory(orderId);
    }

    @PutMapping("/{orderId}/status")
    public CustomerOrder updateStatus(@PathVariable Integer orderId,
                                      @RequestParam String newStatus,
                                      @RequestParam(required = false) Integer changedByUserId,
                                      @RequestParam(required = false) String note) {
        return orderService.updateStatus(orderId, newStatus, changedByUserId, note);
    }

    @GetMapping("/{orderId}/full")
    public OrderResponse getFullOrder(@PathVariable Integer orderId) {
        return orderService.buildOrderResponse(orderId);
    }
}
