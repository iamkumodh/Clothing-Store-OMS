package com.dfine.oms.module4_payment.service;

import com.dfine.oms.module3_order.service.OrderService;
import com.dfine.oms.module4_payment.dto.SubmitBankTransferRequest;
import com.dfine.oms.module4_payment.dto.VerifySlipRequest;
import com.dfine.oms.module4_payment.entity.BankTransferPayment;
import com.dfine.oms.module4_payment.entity.Payment;
import com.dfine.oms.module4_payment.repository.BankTransferRepository;
import com.dfine.oms.module4_payment.repository.PaymentRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

// Service that manages bank transfer payments, customer slip uploads, and staff slip verification.
@Service
public class BankTransferService {

    private final BankTransferRepository bankTransferRepository;
    private final PaymentRepository paymentRepository;
    private final OrderService orderService;

    public BankTransferService(BankTransferRepository bankTransferRepository,
                               PaymentRepository paymentRepository,
                               OrderService orderService) {
        this.bankTransferRepository = bankTransferRepository;
        this.paymentRepository = paymentRepository;
        this.orderService = orderService;
    }

    // Handles customer deposit slip upload and moves the order to AWAITING_PAYMENT_VERIFICATION
    @Transactional(rollbackFor = Exception.class)
    public BankTransferPayment submitTransfer(SubmitBankTransferRequest request) {
        BankTransferPayment transfer = null;

        // Try to locate existing payment record using paymentId or orderId
        if (request.paymentId() != null) {
            transfer = bankTransferRepository.findById(request.paymentId()).orElse(null);
        }

        if (transfer == null && request.orderId() != null) {
            transfer = bankTransferRepository.findFirstByOrderIdOrderByPaymentIdDesc(request.orderId()).orElse(null);
        }

        if (transfer == null) {
            // Check if a parent Payment exists for the given ID
            if (request.paymentId() != null) {
                Payment parent = paymentRepository.findById(request.paymentId())
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Payment not found with id: " + request.paymentId()));
                transfer = new BankTransferPayment();
                transfer.setPaymentId(parent.getPaymentId());
                transfer.setOrderId(parent.getOrderId());
                transfer.setAmount(parent.getAmount());
            } else if (request.orderId() != null) {
                transfer = new BankTransferPayment();
                transfer.setOrderId(request.orderId());
                transfer.setAmount(new BigDecimal("0.00"));
            } else {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Either paymentId or orderId must be provided");
            }
        }

        transfer.setBankName(request.bankName());
        transfer.setDepositReference(request.depositReference());
        transfer.setSlipImageUrl(request.resolveSlipUrl());
        transfer.setPaymentMethod("BANK_TRANSFER");
        transfer.setPaymentStatus("PENDING");
        transfer.setRejectionReason(null);

        BankTransferPayment saved = bankTransferRepository.save(transfer);

        // Notify Module 3 order service that payment slip was received
        if (saved.getOrderId() != null) {
            orderService.updateStatus(saved.getOrderId(), "AWAITING_PAYMENT_VERIFICATION", null, "Customer uploaded bank transfer receipt slip");
        }

        return saved;
    }

    // Main verification method that approves or rejects the slip and updates Module 3 order status
    @Transactional(rollbackFor = Exception.class)
    public BankTransferPayment verify(Integer paymentId, VerifySlipRequest request) {
        BankTransferPayment transfer = bankTransferRepository.findById(paymentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Bank transfer payment not found with id: " + paymentId));

        Integer staffId = request.staffId() != null ? request.staffId() : 1;
        transfer.setVerifiedByStaffId(staffId);
        transfer.setVerifiedAt(LocalDateTime.now());

        if (request.isApproved()) {
            transfer.setPaymentStatus("VERIFIED");
            transfer.setRejectionReason(null);
            System.out.println("Payment slip verified by staff for paymentId: " + paymentId);
            return bankTransferRepository.save(transfer);
        } else {
            transfer.setPaymentStatus("REJECTED");
            String reason = request.rejectionReason() != null ? request.rejectionReason() : "Bank deposit slip could not be verified";
            transfer.setRejectionReason(reason);
            System.out.println("Payment slip rejected for paymentId: " + paymentId);
            return bankTransferRepository.save(transfer);
        }
    }

    // Overloaded verify method for staff verification with staff ID only
    @Transactional(rollbackFor = Exception.class)
    public BankTransferPayment verify(Integer paymentId, Integer staffId) {
        return verify(paymentId, new VerifySlipRequest(staffId != null ? staffId : 1, true, null));
    }

    // Overloaded verify method with default staff ID
    @Transactional(rollbackFor = Exception.class)
    public BankTransferPayment verify(Integer paymentId) {
        return verify(paymentId, 1);
    }

    // Save or update a bank transfer record directly
    @Transactional(rollbackFor = Exception.class)
    public BankTransferPayment save(BankTransferPayment payment) {
        return bankTransferRepository.save(payment);
    }

    // Find bank transfer payment by ID
    @Transactional(readOnly = true)
    public BankTransferPayment getById(Integer id) {
        return bankTransferRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Bank transfer payment not found with id: " + id));
    }

    // Find bank transfer payment by customer order ID
    @Transactional(readOnly = true)
    public BankTransferPayment getByOrderId(Integer orderId) {
        return bankTransferRepository.findFirstByOrderIdOrderByPaymentIdDesc(orderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No bank transfer found for order id: " + orderId));
    }

    // Return all bank transfer payment records
    @Transactional(readOnly = true)
    public List<BankTransferPayment> getAll() {
        return bankTransferRepository.findAll();
    }
}
