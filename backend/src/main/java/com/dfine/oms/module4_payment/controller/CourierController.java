package com.dfine.oms.module4_payment.controller;

import com.dfine.oms.module4_payment.dto.CreateCourierRequest;
import com.dfine.oms.module4_payment.entity.CourierPartner;
import com.dfine.oms.module4_payment.service.CourierService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// REST controller exposing canonical /api/couriers endpoints for logistics partner management.
@RestController
@RequestMapping({"/api/couriers", "/api/courier"})
public class CourierController {

    private final CourierService courierService;

    public CourierController(CourierService courierService) {
        this.courierService = courierService;
    }

    // Register a new courier delivery partner
    @PostMapping
    public ResponseEntity<CourierPartner> createCourier(@Valid @RequestBody CreateCourierRequest request) {
        CourierPartner created = courierService.createCourier(request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    // List all courier partners
    @GetMapping
    public ResponseEntity<List<CourierPartner>> getAllCouriers() {
        return ResponseEntity.ok(courierService.getAll());
    }

    // List active courier partners available for checkout selection
    @GetMapping("/active")
    public ResponseEntity<List<CourierPartner>> getActiveCouriers() {
        return ResponseEntity.ok(courierService.getActiveCouriers());
    }

    // Get specific courier partner by ID
    @GetMapping("/{id}")
    public ResponseEntity<CourierPartner> getCourierById(@PathVariable Integer id) {
        return ResponseEntity.ok(courierService.getById(id));
    }

    // Update courier partner details
    @PutMapping("/{id}")
    public ResponseEntity<CourierPartner> updateCourier(
            @PathVariable Integer id,
            @Valid @RequestBody CreateCourierRequest request) {
        CourierPartner updated = courierService.updateCourier(id, request);
        return ResponseEntity.ok(updated);
    }

    // Remove or deactivate courier partner
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCourier(@PathVariable Integer id) {
        courierService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
