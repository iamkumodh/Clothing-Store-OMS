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

import com.dfine.dfineoms.entity.Customer;
import com.dfine.dfineoms.repository.CustomerRepository;
import com.dfine.oms.module2_product.entity.ProductVariant;
import com.dfine.oms.module2_product.repository.ProductVariantRepository;
import com.dfine.oms.module3_order.dto.*;
import com.dfine.oms.module4_payment.entity.CashOnDeliveryPayment;
import com.dfine.oms.module4_payment.entity.Payment;
import com.dfine.oms.module4_payment.repository.PaymentRepository;

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
    private final ProductVariantRepository variantRepository;
    private final CustomerRepository customerRepository;
    private final PaymentRepository paymentRepository;

    public OrderServiceImpl(CustomerOrderRepository orderRepository,
                            OrderItemRepository orderItemRepository,
                            OrderStatusHistoryRepository historyRepository,
                            CartRepository cartRepository,
                            CartItemRepository cartItemRepository,
                            ProductVariantRepository variantRepository,
                            CustomerRepository customerRepository,
                            PaymentRepository paymentRepository) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.historyRepository = historyRepository;
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.variantRepository = variantRepository;
        this.customerRepository = customerRepository;
        this.paymentRepository = paymentRepository;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public OrderResponse checkoutJson(OrderResponse.CheckoutRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Checkout request cannot be null");
        }

        // 1. Resolve or create customer (guest checkout support)
        Integer customerId = 1;
        if (request.getCustomerEmail() != null && !request.getCustomerEmail().isBlank()) {
            Optional<Customer> existingCustomer = customerRepository.findByEmail(request.getCustomerEmail().trim());
            if (existingCustomer.isPresent()) {
                customerId = existingCustomer.get().getCustomerId().intValue();
            } else {
                try {
                    Customer guest = new Customer();
                    String fullName = request.getCustomerName() != null ? request.getCustomerName().trim() : "Guest Customer";
                    String[] nameParts = fullName.split("\\s+", 2);
                    guest.setFirstName(nameParts[0]);
                    guest.setLastName(nameParts.length > 1 ? nameParts[1] : "");
                    guest.setEmail(request.getCustomerEmail().trim());
                    guest.setContactNumber(request.getCustomerPhone() != null ? request.getCustomerPhone() : "+94 77 123 4567");
                    guest.setShippingAddress(request.getShippingAddress() != null ? request.getShippingAddress() : "Colombo");
                    guest.setCity(request.getShippingCity() != null ? request.getShippingCity() : "Colombo");
                    guest.setDistrict(request.getShippingDistrict() != null ? request.getShippingDistrict() : "Colombo");
                    guest.setProvince(request.getShippingProvince() != null ? request.getShippingProvince() : "Western");
                    Customer savedGuest = customerRepository.save(guest);
                    customerId = savedGuest.getCustomerId().intValue();
                } catch (Exception ex) {
                    customerId = request.getCustomerId() != null ? request.getCustomerId() : 1;
                }
            }
        } else if (request.getCustomerId() != null) {
            customerId = request.getCustomerId();
        }

        // 2. Prepare items and compute pricing
        BigDecimal subtotal = BigDecimal.ZERO;
        List<OrderItem> orderItemsToSave = new ArrayList<>();
        List<OrderItemResponse> detailDtos = new ArrayList<>();

        if (request.getItems() != null && !request.getItems().isEmpty()) {
            for (OrderResponse.CheckoutItem item : request.getItems()) {
                ProductVariant variant = null;
                if (item.getVariantId() != null) {
                    variant = variantRepository.findById(item.getVariantId()).orElse(null);
                }
                if (variant == null && item.getProductId() != null) {
                    try {
                        Integer pId = Integer.parseInt(item.getProductId());
                        List<ProductVariant> variants = variantRepository.findByProduct_ProductId(pId);
                        if (!variants.isEmpty()) {
                            variant = variants.stream()
                                    .filter(v -> item.getSize() != null && item.getSize().equalsIgnoreCase(v.getSizeLabel()))
                                    .findFirst()
                                    .orElse(variants.get(0));
                        }
                    } catch (NumberFormatException ignored) {}
                }

                int qty = (item.getQuantity() != null && item.getQuantity() > 0) ? item.getQuantity() : 1;
                BigDecimal unitPrice = item.getUnitPrice();

                if (variant != null) {
                    int currentStock = variant.getStockQuantity() != null ? variant.getStockQuantity() : 0;
                    if (currentStock < qty) {
                        throw new RuntimeException("Insufficient stock for SKU " + variant.getSku() + " (requested: " + qty + ", available: " + currentStock + ")");
                    }
                    variant.setStockQuantity(currentStock - qty);
                    variantRepository.save(variant);

                    if (unitPrice == null && variant.getProduct() != null) {
                        unitPrice = variant.getProduct().getBasePrice();
                    }
                }

                if (unitPrice == null) {
                    unitPrice = new BigDecimal("2900.00");
                }

                BigDecimal lineTotal = unitPrice.multiply(BigDecimal.valueOf(qty));
                subtotal = subtotal.add(lineTotal);

                OrderItem oi = new OrderItem();
                oi.setVariantId(variant != null ? variant.getVariantId() : (item.getVariantId() != null ? item.getVariantId() : 1));
                oi.setQuantity(qty);
                oi.setUnitPrice(unitPrice);
                oi.setSubtotal(lineTotal);
                oi.setCustomImageUrl(item.getImage() != null ? item.getImage() : (variant != null ? variant.getVariantImageUrl() : null));
                orderItemsToSave.add(oi);

                detailDtos.add(new OrderItemResponse(
                        null,
                        oi.getVariantId(),
                        item.getProductTitle() != null ? item.getProductTitle() : (variant != null && variant.getProduct() != null ? variant.getProduct().getProductName() : "D'fine Garment"),
                        qty,
                        unitPrice,
                        lineTotal,
                        oi.getCustomImageUrl()
                ));
            }
        } else if (request.getCartId() != null) {
            List<CartItem> cartItems = cartItemRepository.findByCartId(request.getCartId());
            if (cartItems.isEmpty()) {
                throw new RuntimeException("Cannot checkout an empty cart");
            }
            for (CartItem ci : cartItems) {
                ProductVariant variant = variantRepository.findById(ci.getVariantId())
                        .orElseThrow(() -> new RuntimeException("Variant not found: " + ci.getVariantId()));
                int qty = ci.getQuantity();
                int currentStock = variant.getStockQuantity() != null ? variant.getStockQuantity() : 0;
                if (currentStock < qty) {
                    throw new RuntimeException("Insufficient stock for SKU " + variant.getSku());
                }
                variant.setStockQuantity(currentStock - qty);
                variantRepository.save(variant);

                BigDecimal unitPrice = variant.getProduct() != null ? variant.getProduct().getBasePrice() : new BigDecimal("2900.00");
                BigDecimal lineTotal = unitPrice.multiply(BigDecimal.valueOf(qty));
                subtotal = subtotal.add(lineTotal);

                OrderItem oi = new OrderItem();
                oi.setVariantId(variant.getVariantId());
                oi.setQuantity(qty);
                oi.setUnitPrice(unitPrice);
                oi.setSubtotal(lineTotal);
                oi.setCustomImageUrl(ci.getCustomImageUrl() != null ? ci.getCustomImageUrl() : variant.getVariantImageUrl());
                orderItemsToSave.add(oi);

                detailDtos.add(new OrderItemResponse(
                        null,
                        variant.getVariantId(),
                        variant.getProduct() != null ? variant.getProduct().getProductName() : "D'fine Garment",
                        qty,
                        unitPrice,
                        lineTotal,
                        oi.getCustomImageUrl()
                ));
            }
            cartItemRepository.deleteAll(cartItems);
        } else {
            throw new RuntimeException("Cannot checkout an empty cart");
        }

        // 3. Shipping Fee and Total Balance
        BigDecimal shippingFee = new BigDecimal("350.00");
        BigDecimal totalPayable = subtotal.add(shippingFee);

        // 4. Create and persist CustomerOrder
        CustomerOrder order = new CustomerOrder();
        order.setOrderNumber("ORD-" + System.currentTimeMillis());
        order.setCustomerId(customerId);
        order.setOrderDate(LocalDateTime.now());
        order.setOrderSource("WEB_STOREFRONT");
        order.setOrderStatus("PENDING");
        order.setSubtotalAmount(subtotal);
        order.setShippingFee(shippingFee);
        order.setTotalPayable(totalPayable);
        order.setCustomerName(request.getCustomerName() != null ? request.getCustomerName() : "Customer");
        order.setCustomerEmail(request.getCustomerEmail() != null ? request.getCustomerEmail() : "customer@dfine.lk");
        order.setCustomerPhone(request.getCustomerPhone() != null ? request.getCustomerPhone() : "+94 77 123 4567");
        String addr = request.getShippingAddress() != null ? request.getShippingAddress() : "Colombo";
        if (request.getShippingCity() != null && !request.getShippingCity().isBlank()) {
            addr = addr + ", " + request.getShippingCity();
        }
        order.setShippingAddressSnapshot(addr);
        order.setShippingDistrictSnapshot(request.getShippingDistrict() != null ? request.getShippingDistrict() : "Colombo");
        order.setShippingProvinceSnapshot(request.getShippingProvince() != null ? request.getShippingProvince() : "Western");

        CustomerOrder savedOrder = orderRepository.save(order);

        // 5. Persist order items
        for (int i = 0; i < orderItemsToSave.size(); i++) {
            OrderItem oi = orderItemsToSave.get(i);
            oi.setOrderId(savedOrder.getOrderId());
            OrderItem savedOi = orderItemRepository.save(oi);
            detailDtos.get(i).setOrderItemId(savedOi.getOrderItemId());
        }

        // 6. Record initial status history
        OrderStatusHistory history = new OrderStatusHistory();
        history.setOrderId(savedOrder.getOrderId());
        history.setPreviousStatus(null);
        history.setNewStatus("PENDING");
        history.setChangedAt(LocalDateTime.now());
        history.setNotes("Order placed online via web storefront");
        historyRepository.save(history);

        // 7. Persist payment record
        String payMethod = request.getPaymentMethod() != null ? request.getPaymentMethod().toUpperCase() : "BANK_TRANSFER";
        if (!payMethod.equals("CASH_ON_DELIVERY") && !payMethod.equals("BANK_TRANSFER")) {
            payMethod = "BANK_TRANSFER";
        }
        try {
            Payment payment;
            if (payMethod.equals("CASH_ON_DELIVERY")) {
                payment = new CashOnDeliveryPayment(savedOrder.getOrderId(), savedOrder.getTotalPayable());
            } else {
                payment = new Payment(savedOrder.getOrderId(), savedOrder.getTotalPayable(), "BANK_TRANSFER", "PENDING");
            }
            paymentRepository.save(payment);
        } catch (Exception ex) {
            System.err.println("Warning: Could not create payment record: " + ex.getMessage());
        }

        // 8. Build and return comprehensive response
        OrderResponse response = new OrderResponse();
        response.setOrderId(savedOrder.getOrderId());
        response.setOrderNumber(savedOrder.getOrderNumber());
        response.setCustomerId(savedOrder.getCustomerId());
        response.setOrderDate(savedOrder.getOrderDate());
        response.setOrderStatus(savedOrder.getOrderStatus());
        response.setSubtotalAmount(savedOrder.getSubtotalAmount());
        response.setShippingFee(savedOrder.getShippingFee());
        response.setCourierCharge(savedOrder.getShippingFee());
        response.setTotalAmount(savedOrder.getTotalPayable());
        response.setTotalPayable(savedOrder.getTotalPayable());
        response.setPaymentMethod(payMethod);
        response.setShippingAddress(savedOrder.getShippingAddressSnapshot());
        response.setShippingAddressSnapshot(savedOrder.getShippingAddressSnapshot());
        response.setRecipientName(savedOrder.getCustomerName());
        response.setCustomerName(savedOrder.getCustomerName());
        response.setRecipientPhone(savedOrder.getCustomerPhone());
        response.setCustomerPhone(savedOrder.getCustomerPhone());
        response.setItems(detailDtos);

        return response;
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

    @Override
    public List<CustomerOrder> getAllOrders() {
        return orderRepository.findAll();
    }

    @Override
    public OrderResponse getOrderByIdOrNumber(String idOrNumber) {
        if (idOrNumber == null || idOrNumber.isBlank()) {
            throw new RuntimeException("Order identifier cannot be empty");
        }

        CustomerOrder order = null;
        try {
            Integer id = Integer.parseInt(idOrNumber.trim());
            order = orderRepository.findById(id).orElse(null);
        } catch (NumberFormatException ignored) {}

        if (order == null) {
            order = orderRepository.findByOrderNumber(idOrNumber.trim())
                    .orElseThrow(() -> new RuntimeException("Order not found: " + idOrNumber));
        }

        List<OrderItem> items = orderItemRepository.findByOrderId(order.getOrderId());
        List<OrderItemResponse> itemDtos = new ArrayList<>();
        for (OrderItem oi : items) {
            ProductVariant variant = oi.getVariantId() != null
                    ? variantRepository.findById(oi.getVariantId()).orElse(null)
                    : null;
            String productTitle = (variant != null && variant.getProduct() != null)
                    ? variant.getProduct().getProductName()
                    : "D'fine Garment";
            String imageUrl = oi.getCustomImageUrl() != null
                    ? oi.getCustomImageUrl()
                    : (variant != null ? variant.getVariantImageUrl() : null);

            itemDtos.add(new OrderItemResponse(
                    oi.getOrderItemId(),
                    oi.getVariantId(),
                    productTitle,
                    oi.getQuantity(),
                    oi.getUnitPrice(),
                    oi.getSubtotal(),
                    imageUrl
            ));
        }

        String paymentMethod = "BANK_TRANSFER";
        try {
            Optional<Payment> paymentBox = paymentRepository.findFirstByOrderIdOrderByPaymentIdDesc(order.getOrderId());
            if (paymentBox.isPresent()) {
                paymentMethod = paymentBox.get().getPaymentMethod();
            }
        } catch (Exception ignored) {}

        OrderResponse response = new OrderResponse();
        response.setOrderId(order.getOrderId());
        response.setOrderNumber(order.getOrderNumber());
        response.setCustomerId(order.getCustomerId());
        response.setOrderDate(order.getOrderDate());
        response.setOrderStatus(order.getOrderStatus());
        response.setSubtotalAmount(order.getSubtotalAmount());
        response.setShippingFee(order.getShippingFee());
        response.setCourierCharge(order.getShippingFee());
        response.setTotalAmount(order.getTotalPayable());
        response.setTotalPayable(order.getTotalPayable());
        response.setPaymentMethod(paymentMethod);
        response.setShippingAddress(order.getShippingAddressSnapshot());
        response.setShippingAddressSnapshot(order.getShippingAddressSnapshot());
        response.setRecipientName(order.getCustomerName());
        response.setCustomerName(order.getCustomerName());
        response.setRecipientPhone(order.getCustomerPhone());
        response.setCustomerPhone(order.getCustomerPhone());
        response.setItems(itemDtos);

        return response;
    }
}
