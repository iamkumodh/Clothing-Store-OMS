package com.dfine.oms.module4_payment.service;

import com.dfine.oms.module3_order.service.OrderService;
import com.dfine.oms.module4_payment.dto.DispatchShipmentRequest;
import com.dfine.oms.module4_payment.dto.UpdateShipmentStatusRequest;
import com.dfine.oms.module4_payment.entity.CourierPartner;
import com.dfine.oms.module4_payment.entity.DeliveryShipment;
import com.dfine.oms.module4_payment.repository.CourierRepository;
import com.dfine.oms.module4_payment.repository.DeliveryRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

// Service that manages parcel dispatch, courier assignment, and package tracking updates.
@Service
public class DeliveryService {

    private final DeliveryRepository deliveryRepository;
    private final CourierRepository courierRepository;
    private final OrderService orderService;

    public DeliveryService(DeliveryRepository deliveryRepository,
                           CourierRepository courierRepository,
                           OrderService orderService) {
        this.deliveryRepository = deliveryRepository;
        this.courierRepository = courierRepository;
        this.orderService = orderService;
    }

    // Dispatches an order with a selected courier partner and marks the order as DISPATCHED
    @Transactional(rollbackFor = Exception.class)
    public DeliveryShipment dispatchOrder(DispatchShipmentRequest request) {
        if (request.orderId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Order ID is required for dispatch");
        }

        CourierPartner courier = courierRepository.findById(request.courierId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Courier partner not found with id: " + request.courierId()));

        // Check if a shipment already exists for this order
        DeliveryShipment shipment = deliveryRepository.findByOrderId(request.orderId()).orElse(new DeliveryShipment());

        System.out.println("DEBUG: Dispatching order " + request.orderId() + " with courier " + courier.getCourierName());

        String tracking = request.trackingNumber();
        if (tracking == null || tracking.isBlank()) {
            tracking = "SHIP-" + request.orderId();
        }

        BigDecimal charge = request.courierCharge() != null ? request.courierCharge() : new BigDecimal("350.00");
        String location = request.initialLocation() != null ? request.initialLocation() : "Central Warehouse";

        shipment.setOrderId(request.orderId());
        shipment.setCourierId(courier.getCourierId());
        shipment.setTrackingNumber(tracking);
        shipment.setCourierCharge(charge);
        shipment.setDeliveryStatus("DISPATCHED");
        shipment.setCurrentLocation(location);
        shipment.setDispatchedAt(LocalDateTime.now());

        DeliveryShipment saved = deliveryRepository.save(shipment);

        // Update Module 3 order status to DISPATCHED
        orderService.updateStatus(request.orderId(), "DISPATCHED", request.staffUserId(),
                "Parcel dispatched via " + courier.getCourierName() + " (Tracking: " + tracking + ")");

        return saved;
    }

    // Updates checkpoint location and advances delivery status (e.g. IN_TRANSIT, DELIVERED)
    @Transactional(rollbackFor = Exception.class)
    public DeliveryShipment updateShipmentStatus(Integer deliveryId, UpdateShipmentStatusRequest request) {
        DeliveryShipment shipment = deliveryRepository.findById(deliveryId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Delivery shipment not found with id: " + deliveryId));

        shipment.setDeliveryStatus(request.deliveryStatus());
        if (request.currentLocation() != null && !request.currentLocation().isBlank()) {
            shipment.setCurrentLocation(request.currentLocation());
        }

        if ("DELIVERED".equalsIgnoreCase(request.deliveryStatus())) {
            shipment.setDeliveredAt(LocalDateTime.now());
            DeliveryShipment saved = deliveryRepository.save(shipment);

            // Notify Module 3 order service that parcel has been delivered
            orderService.updateStatus(saved.getOrderId(), "DELIVERED", request.staffUserId(),
                    "Parcel successfully delivered to recipient at " + shipment.getCurrentLocation());
            return saved;
        }

        return deliveryRepository.save(shipment);
    }

    // Save or update shipment directly
    @Transactional(rollbackFor = Exception.class)
    public DeliveryShipment save(DeliveryShipment shipment) {
        return deliveryRepository.save(shipment);
    }

    // Retrieve all shipments
    @Transactional(readOnly = true)
    public List<DeliveryShipment> getAll() {
        return deliveryRepository.findAll();
    }

    // Retrieve shipment by primary key ID
    @Transactional(readOnly = true)
    public DeliveryShipment getById(Integer id) {
        return deliveryRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Delivery shipment not found with id: " + id));
    }

    // Retrieve shipment by customer order ID
    @Transactional(readOnly = true)
    public DeliveryShipment getByOrderId(Integer orderId) {
        return deliveryRepository.findByOrderId(orderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No delivery shipment found for order id: " + orderId));
    }

    // Retrieve shipment by courier tracking number
    @Transactional(readOnly = true)
    public DeliveryShipment getByTrackingNumber(String trackingNumber) {
        return deliveryRepository.findByTrackingNumber(trackingNumber)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No shipment found for tracking number: " + trackingNumber));
    }

    // Delete shipment
    @Transactional(rollbackFor = Exception.class)
    public void delete(Integer id) {
        if (!deliveryRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Delivery shipment not found with id: " + id);
        }
        deliveryRepository.deleteById(id);
    }
}
