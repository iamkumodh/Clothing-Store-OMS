package com.dfine.oms.module4_payment.repository;

import com.dfine.oms.module4_payment.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

// Repository interface for database operations on payments.
@Repository
public interface PaymentRepository extends JpaRepository<Payment, Integer> {

    // Find all payment attempts for a given order
    List<Payment> findByOrderId(Integer orderId);

    // Find the latest payment for an order
    Optional<Payment> findFirstByOrderIdOrderByPaymentIdDesc(Integer orderId);

    // Filter payments by current verification or payment status
    List<Payment> findByPaymentStatus(String paymentStatus);
}
