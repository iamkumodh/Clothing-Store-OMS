package com.dfine.oms.module4_payment.controller;

import com.dfine.oms.module4_payment.dto.DispatchShipmentRequest;
import com.dfine.oms.module4_payment.dto.UpdateShipmentStatusRequest;
import com.dfine.oms.module4_payment.entity.DeliveryShipment;
import com.dfine.oms.module4_payment.service.DeliveryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// REST controller exposing canonical /api/shipments endpoints for order dispatch and live tracking.
@RestController
@RequestMapping({"/api/shipments", "/api/delivery"})
public class DeliveryController {

    private final DeliveryService deliveryService;

    public DeliveryController(DeliveryService deliveryService) {
        this.deliveryService = deliveryService;
    }

    // Dispatches an order, assigns courier, and marks order as DISPATCHED
    @PostMapping({"/dispatch", ""})
    public ResponseEntity<DeliveryShipment> dispatchOrder(@Valid @RequestBody DispatchShipmentRequest request) {
        DeliveryShipment shipment = deliveryService.dispatchOrder(request);
        return new ResponseEntity<>(shipment, HttpStatus.CREATED);
    }

    // List all delivery shipment records
    @GetMapping
    public ResponseEntity<List<DeliveryShipment>> getAllShipments() {
        return ResponseEntity.ok(deliveryService.getAll());
    }

    // Get shipment details by primary key ID
    @GetMapping("/{id}")
    public ResponseEntity<DeliveryShipment> getShipmentById(@PathVariable Integer id) {
        return ResponseEntity.ok(deliveryService.getById(id));
    }

    // Get shipment details by customer order ID
    @GetMapping("/order/{orderId}")
    public ResponseEntity<DeliveryShipment> getShipmentByOrderId(@PathVariable Integer orderId) {
        return ResponseEntity.ok(deliveryService.getByOrderId(orderId));
    }

    // Look up live shipment tracking by courier tracking number
    @GetMapping("/track/{trackingNumber}")
    public ResponseEntity<DeliveryShipment> getShipmentByTrackingNumber(@PathVariable String trackingNumber) {
        return ResponseEntity.ok(deliveryService.getByTrackingNumber(trackingNumber));
    }

    // Updates checkpoint location and delivery status (marks DELIVERED when parcel arrives)
    @RequestMapping(value = {"/{id}/status", "/{id}/location"}, method = {RequestMethod.PATCH, RequestMethod.PUT})
    public ResponseEntity<DeliveryShipment> updateStatus(
            @PathVariable Integer id,
            @Valid @RequestBody UpdateShipmentStatusRequest request) {
        DeliveryShipment updated = deliveryService.updateShipmentStatus(id, request);
        return ResponseEntity.ok(updated);
    }

    // Delete a delivery shipment record
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteShipment(@PathVariable Integer id) {
        deliveryService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
