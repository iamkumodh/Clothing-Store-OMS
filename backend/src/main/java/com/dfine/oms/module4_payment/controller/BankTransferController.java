package com.dfine.oms.module4_payment.controller;

import com.dfine.oms.module4_payment.dto.SubmitBankTransferRequest;
import com.dfine.oms.module4_payment.dto.VerifySlipRequest;
import com.dfine.oms.module4_payment.entity.BankTransferPayment;
import com.dfine.oms.module4_payment.service.BankTransferService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// Dedicated REST controller for bank transfer payments and slip verification.
@RestController
@RequestMapping("/api/bank-transfer")
public class BankTransferController {

    private final BankTransferService bankTransferService;

    public BankTransferController(BankTransferService bankTransferService) {
        this.bankTransferService = bankTransferService;
    }

    // Customer submits bank transfer deposit receipt details
    @PostMapping
    public ResponseEntity<BankTransferPayment> submitPayment(@Valid @RequestBody SubmitBankTransferRequest request) {
        BankTransferPayment saved = bankTransferService.submitTransfer(request);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    // Staff verifies or rejects bank transfer slip proof
    @RequestMapping(value = "/{id}/verify", method = {RequestMethod.PUT, RequestMethod.PATCH})
    public ResponseEntity<BankTransferPayment> verify(
            @PathVariable Integer id,
            @RequestParam(required = false) Integer staffId,
            @RequestBody(required = false) VerifySlipRequest request) {
        VerifySlipRequest effectiveRequest = (request != null)
                ? request
                : new VerifySlipRequest(staffId != null ? staffId : 1, true, null);

        BankTransferPayment verified = bankTransferService.verify(id, effectiveRequest);
        return ResponseEntity.ok(verified);
    }

    // Get all bank transfer records
    @GetMapping
    public ResponseEntity<List<BankTransferPayment>> getAll() {
        return ResponseEntity.ok(bankTransferService.getAll());
    }

    // Get bank transfer by primary key ID
    @GetMapping("/{id}")
    public ResponseEntity<BankTransferPayment> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(bankTransferService.getById(id));
    }

    // Get bank transfer by order ID
    @GetMapping("/order/{orderId}")
    public ResponseEntity<BankTransferPayment> getByOrderId(@PathVariable Integer orderId) {
        return ResponseEntity.ok(bankTransferService.getByOrderId(orderId));
    }
}
