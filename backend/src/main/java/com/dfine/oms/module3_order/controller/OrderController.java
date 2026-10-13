package com.dfine.oms.module3_order.controller;

import com.dfine.oms.module3_order.dto.OrderResponse;
import com.dfine.oms.module3_order.entity.CustomerOrder;
import com.dfine.oms.module3_order.entity.OrderItem;
import com.dfine.oms.module3_order.entity.OrderStatusHistory;
import com.dfine.oms.module3_order.service.OrderService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    // Modern JSON checkout supporting cart and direct items with guest checkout
    @PostMapping(value = "/checkout", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<OrderResponse> checkoutJson(@RequestBody OrderResponse.CheckoutRequest request) {
        OrderResponse response = orderService.checkoutJson(request);
        return ResponseEntity.ok(response);
    }

    // Legacy form-encoded checkout
    @PostMapping(value = "/checkout", consumes = {MediaType.APPLICATION_FORM_URLENCODED_VALUE, MediaType.MULTIPART_FORM_DATA_VALUE})
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

    // List all orders or filter by customer
    @GetMapping
    public ResponseEntity<List<CustomerOrder>> getAllOrders(@RequestParam(required = false) Integer customerId) {
        if (customerId != null) {
            return ResponseEntity.ok(orderService.getOrderHistory(customerId));
        }
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    // Get order by numeric ID or order reference number (e.g. ORD-xxx)
    @GetMapping("/{orderId}")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable String orderId) {
        return ResponseEntity.ok(orderService.getOrderByIdOrNumber(orderId));
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
