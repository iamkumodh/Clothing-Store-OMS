package com.dfine.oms.module4_payment.repository;

import com.dfine.oms.module4_payment.entity.CashOnDeliveryPayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

// Repository interface for Cash On Delivery payment records.
@Repository
public interface CodRepository extends JpaRepository<CashOnDeliveryPayment, Integer> {

    // Find COD payment details by order ID
    Optional<CashOnDeliveryPayment> findFirstByOrderIdOrderByPaymentIdDesc(Integer orderId);
}
