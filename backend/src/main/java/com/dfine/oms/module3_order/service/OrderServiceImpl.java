package com.dfine.oms.module3_order.service;

import com.dfine.oms.module3_order.dto.OrderItemResponse;
import com.dfine.oms.module3_order.dto.OrderResponse;
import com.dfine.oms.module3_order.entity.Cart;
import com.dfine.oms.module3_order.entity.CartItem;
import com.dfine.oms.module3_order.entity.CustomerOrder;
import com.dfine.oms.module3_order.entity.OrderItem;
import com.dfine.oms.module3_order.entity.OrderStatusHistory;
import com.dfine.oms.module3_order.repository.CartItemRepository;
import com.dfine.oms.module3_order.repository.CartRepository;
import com.dfine.oms.module3_order.repository.CustomerOrderRepository;
import com.dfine.oms.module3_order.repository.OrderItemRepository;
import com.dfine.oms.module3_order.repository.OrderStatusHistoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class OrderServiceImpl implements OrderService {

    private final CustomerOrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final OrderStatusHistoryRepository historyRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;

    public OrderServiceImpl(CustomerOrderRepository orderRepository,
                            OrderItemRepository orderItemRepository,
                            OrderStatusHistoryRepository historyRepository,
                            CartRepository cartRepository,
                            CartItemRepository cartItemRepository) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.historyRepository = historyRepository;
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
    }

    @Override
    @Transactional
    public CustomerOrder checkout(Integer cartId, Integer customerId,
                                  String customerName, String customerEmail,
                                  String customerPhone, String shippingAddress,
                                  String shippingDistrict, String shippingProvince) {

        List<CartItem> items = cartItemRepository.findByCartId(cartId);

        if (items.isEmpty()) {
            throw new RuntimeException("Cannot checkout an empty cart");
        }

        BigDecimal subtotal = BigDecimal.ZERO;
        for (CartItem item : items) {
            BigDecimal unitPrice = new BigDecimal("1800.00");
            BigDecimal lineTotal = unitPrice.multiply(new BigDecimal(item.getQuantity()));
            subtotal = subtotal.add(lineTotal);
        }

        BigDecimal shippingFee = new BigDecimal("350.00");
        BigDecimal totalPayable = subtotal.add(shippingFee);

        CustomerOrder order = new CustomerOrder();
        order.setOrderNumber("ORD-" + System.currentTimeMillis());

        order.setCustomerId(customerId);
        order.setOrderDate(LocalDateTime.now());
        order.setOrderSource("WEB_STOREFRONT");
        order.setOrderStatus("PENDING");
        order.setSubtotalAmount(subtotal);
        order.setShippingFee(shippingFee);
        order.setTotalPayable(totalPayable);
        order.setCustomerName(customerName);
        order.setCustomerEmail(customerEmail);
        order.setCustomerPhone(customerPhone);
        order.setShippingAddressSnapshot(shippingAddress);
        order.setShippingDistrictSnapshot(shippingDistrict);
        order.setShippingProvinceSnapshot(shippingProvince);

        CustomerOrder savedOrder = orderRepository.save(order);

        for (CartItem item : items) {
            BigDecimal unitPrice = new BigDecimal("1800.00");
            BigDecimal lineTotal = unitPrice.multiply(new BigDecimal(item.getQuantity()));

            OrderItem orderItem = new OrderItem();
            orderItem.setOrderId(savedOrder.getOrderId());
            orderItem.setVariantId(item.getVariantId());
            orderItem.setQuantity(item.getQuantity());
            orderItem.setUnitPrice(unitPrice);
            orderItem.setSubtotal(lineTotal);
            orderItem.setCustomImageUrl(item.getCustomImageUrl());
            orderItemRepository.save(orderItem);
        }

        OrderStatusHistory firstEntry = new OrderStatusHistory();
        firstEntry.setOrderId(savedOrder.getOrderId());
        firstEntry.setPreviousStatus(null);
        firstEntry.setNewStatus("PENDING");
        firstEntry.setChangedAt(LocalDateTime.now());
        firstEntry.setNotes("Order placed by customer");
        historyRepository.save(firstEntry);

        cartItemRepository.deleteAll(items);
        Optional<Cart> cartBox = cartRepository.findById(cartId);
        if (cartBox.isPresent()) {
            cartRepository.delete(cartBox.get());
        }

        return savedOrder;
    }

    @Override
    public List<CustomerOrder> getOrderHistory(Integer customerId) {
        return orderRepository.findByCustomerIdOrderByOrderDateDesc(customerId);
    }

    @Override
    public List<OrderItem> getOrderItems(Integer orderId) {
        return orderItemRepository.findByOrderId(orderId);
    }

    @Override
    public List<OrderStatusHistory> getStatusHistory(Integer orderId) {
        return historyRepository.findByOrderIdOrderByChangedAtAsc(orderId);
    }

    @Override
    @Transactional
    public CustomerOrder updateStatus(Integer orderId, String newStatus,
                                      Integer changedByUserId, String note) {

        Optional<CustomerOrder> orderBox = orderRepository.findById(orderId);
        if (!orderBox.isPresent()) {
            throw new RuntimeException("Order not found");
        }

        CustomerOrder order = orderBox.get();
        String previousStatus = order.getOrderStatus();

        order.setOrderStatus(newStatus);
        CustomerOrder updatedOrder = orderRepository.save(order);

        OrderStatusHistory entry = new OrderStatusHistory();
        entry.setOrderId(orderId);
        entry.setChangedByUserId(changedByUserId);
        entry.setPreviousStatus(previousStatus);
        entry.setNewStatus(newStatus);
        entry.setChangedAt(LocalDateTime.now());
        entry.setNotes(note);
        historyRepository.save(entry);

        return updatedOrder;
    }

    @Override
    public OrderResponse buildOrderResponse(Integer orderId) {
        CustomerOrder order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        List<OrderItem> items = orderItemRepository.findByOrderId(orderId);
        List<OrderItemResponse> itemResponses = new ArrayList<>();

        for (OrderItem item : items) {
            itemResponses.add(new OrderItemResponse(
                    item.getOrderItemId(),
                    item.getVariantId(),
                    item.getQuantity(),
                    item.getUnitPrice(),
                    item.getSubtotal()
            ));
        }

        return new OrderResponse(
                order.getOrderId(),
                order.getOrderNumber(),
                order.getOrderStatus(),
                order.getTotalPayable(),
                itemResponses
        );
    }
}
