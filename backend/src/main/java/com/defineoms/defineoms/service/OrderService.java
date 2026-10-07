package com.defineoms.defineoms.service;

import com.defineoms.defineoms.entity.*;
import com.defineoms.defineoms.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    @Autowired private CustomerOrderRepository orderRepository;
    @Autowired private OrderItemRepository orderItemRepository;
    @Autowired private OrderStatusHistoryRepository historyRepository;
    @Autowired private CartRepository cartRepository;
    @Autowired private CartItemRepository cartItemRepository;


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

        BigDecimal shippingFee = new BigDecimal("350.00"); // flat rate example
        BigDecimal totalPayable = subtotal.add(shippingFee);


        CustomerOrder order = new CustomerOrder();
        order.setOrderNumber("ORD-" + System.currentTimeMillis()); // simple

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
            BigDecimal unitPrice = new BigDecimal("1800.00"); // same
            // placeholder
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
        firstEntry.setPreviousStatus(null); // nothing before this, it's brand new
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

    public List<CustomerOrder> getOrderHistory(Integer customerId) {
        return orderRepository.findByCustomerIdOrderByOrderDateDesc(customerId);
    }

    public List<OrderItem> getOrderItems(Integer orderId) {

        return orderItemRepository.findByOrderId(orderId);
    }

    public List<OrderStatusHistory> getStatusHistory(Integer orderId) {
        return historyRepository.findByOrderIdOrderByChangedAtAsc(orderId);
    }
}
