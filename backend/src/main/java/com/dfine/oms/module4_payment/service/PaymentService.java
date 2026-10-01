package com.dfine.oms.module4_payment.service;

import com.dfine.oms.module3_order.service.OrderService;
import com.dfine.oms.module4_payment.dto.CreatePaymentRequest;
import com.dfine.oms.module4_payment.entity.BankTransferPayment;
import com.dfine.oms.module4_payment.entity.CashOnDeliveryPayment;
import com.dfine.oms.module4_payment.entity.Payment;
import com.dfine.oms.module4_payment.repository.BankTransferRepository;
import com.dfine.oms.module4_payment.repository.CodRepository;
import com.dfine.oms.module4_payment.repository.PaymentRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

// Service that manages customer payments and creates polymorphic payment records.
@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final BankTransferRepository bankTransferRepository;
    private final CodRepository codRepository;
    private final OrderService orderService;

    public PaymentService(PaymentRepository paymentRepository,
                          BankTransferRepository bankTransferRepository,
                          CodRepository codRepository,
                          OrderService orderService) {
        this.paymentRepository = paymentRepository;
        this.bankTransferRepository = bankTransferRepository;
        this.codRepository = codRepository;
        this.orderService = orderService;
    }

    // Handles creating a payment using request DTO
    @Transactional(rollbackFor = Exception.class)
    public Payment createPayment(CreatePaymentRequest request) {
        if (request.amount().compareTo(BigDecimal.ZERO) < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Payment amount cannot be negative");
        }

        String method = request.paymentMethod().toUpperCase();

        if ("BANK_TRANSFER".equals(method)) {
            // Polymorphic child record for bank transfer
            BankTransferPayment transfer = new BankTransferPayment();
            transfer.setOrderId(request.orderId());
            transfer.setAmount(request.amount());
            transfer.setPaymentMethod("BANK_TRANSFER");
            transfer.setPaymentStatus("PENDING");
            transfer.setCreatedAt(LocalDateTime.now());
            transfer.setBankName(request.bankName() != null ? request.bankName() : "Commercial Bank of Ceylon");
            transfer.setDepositReference(request.depositReference());
            transfer.setSlipImageUrl(request.slipImageUrl() != null ? request.slipImageUrl() : "https://cdn.dfine.store/slips/placeholder_pending.png");

            BankTransferPayment saved = bankTransferRepository.save(transfer);

            // If a slip was already provided, update order status to awaiting verification
            if (request.slipImageUrl() != null && !request.slipImageUrl().isBlank()) {
                orderService.updateStatus(request.orderId(), "AWAITING_PAYMENT_VERIFICATION", null, "Order placed and bank deposit slip attached");
            }
            return saved;
        } else if ("CASH_ON_DELIVERY".equals(method)) {
            // Polymorphic child record for cash on delivery
            CashOnDeliveryPayment cod = new CashOnDeliveryPayment();
            cod.setOrderId(request.orderId());
            cod.setAmount(request.amount());
            cod.setPaymentMethod("CASH_ON_DELIVERY");
            cod.setPaymentStatus("PENDING");
            cod.setCreatedAt(LocalDateTime.now());
            cod.setCashCollectionStatus("UNCOLLECTED");

            return codRepository.save(cod);
        } else {
            // Standard parent payment record
            Payment payment = new Payment();
            payment.setOrderId(request.orderId());
            payment.setAmount(request.amount());
            payment.setPaymentMethod(method);
            payment.setPaymentStatus("PENDING");
            payment.setCreatedAt(LocalDateTime.now());

            return paymentRepository.save(payment);
        }
    }

    // Overloaded method to support raw entity saves if called directly
    @Transactional(rollbackFor = Exception.class)
    public Payment createPayment(Payment payment) {
        if (payment.getCreatedAt() == null) {
            payment.setCreatedAt(LocalDateTime.now());
        }
        if (payment.getPaymentStatus() == null) {
            payment.setPaymentStatus("PENDING");
        }
        return paymentRepository.save(payment);
    }

    // Returns all payment records in the database
    @Transactional(readOnly = true)
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    // Look up a payment by its primary key ID
    @Transactional(readOnly = true)
    public Payment getPayment(Integer paymentId) {
        return paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Payment not found with id: " + paymentId));
    }

    // Look up the latest payment record for a specific customer order
    @Transactional(readOnly = true)
    public Payment getPaymentByOrderId(Integer orderId) {
        return paymentRepository.findFirstByOrderIdOrderByPaymentIdDesc(orderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No payment found for order id: " + orderId));
    }

    // Delete a payment record
    @Transactional(rollbackFor = Exception.class)
    public void deletePayment(Integer paymentId) {
        if (!paymentRepository.existsById(paymentId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Payment not found with id: " + paymentId);
        }
        paymentRepository.deleteById(paymentId);
    }
}
