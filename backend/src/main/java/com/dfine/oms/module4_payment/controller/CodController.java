package com.dfine.oms.module4_payment.controller;

import com.dfine.oms.module4_payment.dto.CodSettleRequest;
import com.dfine.oms.module4_payment.entity.CashOnDeliveryPayment;
import com.dfine.oms.module4_payment.service.CodService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// Dedicated REST controller for Cash On Delivery payment operations.
@RestController
@RequestMapping("/api/cod")
public class CodController {

    private final CodService codService;

    public CodController(CodService codService) {
        this.codService = codService;
    }

    // Save COD payment record
    @PostMapping
    public ResponseEntity<CashOnDeliveryPayment> save(@RequestBody CashOnDeliveryPayment payment) {
        CashOnDeliveryPayment saved = codService.save(payment);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    // Reconcile and settle COD payment once courier remits collected cash
    @RequestMapping(value = "/{id}/settle", method = {RequestMethod.PUT, RequestMethod.PATCH})
    public ResponseEntity<CashOnDeliveryPayment> settleCod(
            @PathVariable Integer id,
            @RequestBody(required = false) CodSettleRequest request) {
        CashOnDeliveryPayment settled = codService.settleCod(id, request);
        return ResponseEntity.ok(settled);
    }

    // List all COD payments
    @GetMapping
    public ResponseEntity<List<CashOnDeliveryPayment>> getAll() {
        return ResponseEntity.ok(codService.getAll());
    }

    // Get COD payment by ID
    @GetMapping("/{id}")
    public ResponseEntity<CashOnDeliveryPayment> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(codService.getById(id));
    }

    // Get COD payment by order ID
    @GetMapping("/order/{orderId}")
    public ResponseEntity<CashOnDeliveryPayment> getByOrderId(@PathVariable Integer orderId) {
        return ResponseEntity.ok(codService.getByOrderId(orderId));
    }

    // Delete COD payment
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        codService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
