package com.dfine.oms.module4_payment.controller;

import com.dfine.oms.module4_payment.dto.*;
import com.dfine.oms.module4_payment.entity.BankTransferPayment;
import com.dfine.oms.module4_payment.entity.CashOnDeliveryPayment;
import com.dfine.oms.module4_payment.entity.Payment;
import com.dfine.oms.module4_payment.service.BankTransferService;
import com.dfine.oms.module4_payment.service.CodService;
import com.dfine.oms.module4_payment.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// REST controller exposing canonical /api/payments endpoints for customer and staff payments.
@RestController
@RequestMapping({"/api/payments", "/api/payment"})
public class PaymentController {

    private final PaymentService paymentService;
    private final BankTransferService bankTransferService;
    private final CodService codService;

    public PaymentController(PaymentService paymentService,
                             BankTransferService bankTransferService,
                             CodService codService) {
        this.paymentService = paymentService;
        this.bankTransferService = bankTransferService;
        this.codService = codService;
    }

    // Creates payment upon order checkout
    @PostMapping
    public ResponseEntity<Payment> createPayment(@Valid @RequestBody CreatePaymentRequest request) {
        Payment saved = paymentService.createPayment(request);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    // List all recorded payments
    @GetMapping
    public ResponseEntity<List<Payment>> getAllPayments() {
        return ResponseEntity.ok(paymentService.getAllPayments());
    }

    // Get specific payment details by ID
    @GetMapping("/{id}")
    public ResponseEntity<Payment> getPaymentById(@PathVariable Integer id) {
        return ResponseEntity.ok(paymentService.getPayment(id));
    }

    // Get payment associated with an order ID
    @GetMapping("/order/{orderId}")
    public ResponseEntity<Payment> getPaymentByOrderId(@PathVariable Integer orderId) {
        return ResponseEntity.ok(paymentService.getPaymentByOrderId(orderId));
    }

    // Upload bank transfer deposit slip proof for a payment
    @PostMapping("/{id}/upload-slip")
    public ResponseEntity<BankTransferPayment> uploadSlip(
            @PathVariable Integer id,
            @Valid @RequestBody SubmitBankTransferRequest request) {
        // Ensure request paymentId matches path variable
        SubmitBankTransferRequest effectiveRequest = new SubmitBankTransferRequest(
                id,
                request.orderId(),
                request.bankName(),
                request.depositReference(),
                request.slipImageUrl(),
                request.slipImageBase64()
        );
        BankTransferPayment saved = bankTransferService.submitTransfer(effectiveRequest);
        return ResponseEntity.ok(saved);
    }

    // Staff approves or rejects a bank transfer deposit receipt slip
    @RequestMapping(value = "/{id}/verify-slip", method = {RequestMethod.PATCH, RequestMethod.PUT})
    public ResponseEntity<BankTransferPayment> verifySlip(
            @PathVariable Integer id,
            @RequestParam(required = false) Integer staffId,
            @RequestBody(required = false) VerifySlipRequest request) {
        VerifySlipRequest effectiveRequest = (request != null)
                ? request
                : new VerifySlipRequest(staffId != null ? staffId : 1, true, null);

        BankTransferPayment verified = bankTransferService.verify(id, effectiveRequest);
        return ResponseEntity.ok(verified);
    }

    // Reconcile and settle Cash On Delivery payment collected by courier
    @RequestMapping(value = {"/{id}/cod-settle", "/cod/{id}"}, method = {RequestMethod.PATCH, RequestMethod.PUT})
    public ResponseEntity<CashOnDeliveryPayment> settleCod(
            @PathVariable Integer id,
            @RequestBody(required = false) CodSettleRequest request) {
        CashOnDeliveryPayment settled = codService.settleCod(id, request);
        return ResponseEntity.ok(settled);
    }

    // Remove a payment record
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePayment(@PathVariable Integer id) {
        paymentService.deletePayment(id);
        return ResponseEntity.noContent().build();
    }
}
