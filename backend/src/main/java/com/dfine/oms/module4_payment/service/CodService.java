package com.dfine.oms.module4_payment.service;

import com.dfine.oms.module3_order.service.OrderService;
import com.dfine.oms.module4_payment.dto.CodSettleRequest;
import com.dfine.oms.module4_payment.entity.CashOnDeliveryPayment;
import com.dfine.oms.module4_payment.repository.CodRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

// Service that manages Cash On Delivery payments and courier remittance settlement.
@Service
public class CodService {

    private final CodRepository codRepository;
    private final OrderService orderService;

    public CodService(CodRepository codRepository, OrderService orderService) {
        this.codRepository = codRepository;
        this.orderService = orderService;
    }

    // Save a new COD payment record
    @Transactional(rollbackFor = Exception.class)
    public CashOnDeliveryPayment save(CashOnDeliveryPayment payment) {
        if (payment.getCashCollectionStatus() == null) {
            payment.setCashCollectionStatus("UNCOLLECTED");
        }
        if (payment.getPaymentStatus() == null) {
            payment.setPaymentStatus("PENDING");
        }
        return codRepository.save(payment);
    }

    // Reconcile and settle COD payment once courier collects and remits money to the store
    @Transactional(rollbackFor = Exception.class)
    public CashOnDeliveryPayment settleCod(Integer paymentId, CodSettleRequest request) {
        CashOnDeliveryPayment cod = codRepository.findById(paymentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "COD payment not found with id: " + paymentId));

        String status = (request != null && request.cashCollectionStatus() != null)
                ? request.cashCollectionStatus()
                : "REMITTED_TO_STORE";

        BigDecimal collectedAmount = (request != null && request.collectedAmount() != null)
                ? request.collectedAmount()
                : cod.getAmount();

        LocalDateTime remittanceDate = (request != null && request.courierRemittanceDate() != null)
                ? request.courierRemittanceDate()
                : LocalDateTime.now();

        cod.setCashCollectionStatus(status);
        cod.setCollectedAmount(collectedAmount);
        cod.setCourierRemittanceDate(remittanceDate);
        cod.setPaymentStatus("VERIFIED");

        CashOnDeliveryPayment saved = codRepository.save(cod);

        // Update Module 3 order status to PROCESSING once payment is settled
        if (saved.getOrderId() != null) {
            orderService.updateStatus(saved.getOrderId(), "PROCESSING", null, "Cash on delivery payment collected and remitted to store");
        }

        return saved;
    }

    // Retrieve all Cash On Delivery records
    @Transactional(readOnly = true)
    public List<CashOnDeliveryPayment> getAll() {
        return codRepository.findAll();
    }

    // Retrieve COD payment by primary key ID
    @Transactional(readOnly = true)
    public CashOnDeliveryPayment getById(Integer id) {
        return codRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "COD payment not found with id: " + id));
    }

    // Retrieve COD payment by customer order ID
    @Transactional(readOnly = true)
    public CashOnDeliveryPayment getByOrderId(Integer orderId) {
        return codRepository.findFirstByOrderIdOrderByPaymentIdDesc(orderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No COD payment found for order id: " + orderId));
    }

    // Delete a COD payment record
    @Transactional(rollbackFor = Exception.class)
    public void delete(Integer id) {
        if (!codRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "COD payment not found with id: " + id);
        }
        codRepository.deleteById(id);
    }
}
