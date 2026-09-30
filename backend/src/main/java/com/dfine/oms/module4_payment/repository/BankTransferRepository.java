package com.dfine.oms.module4_payment.repository;

import com.dfine.oms.module4_payment.entity.BankTransferPayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

// Repository interface for bank transfer deposit slips.
@Repository
public interface BankTransferRepository extends JpaRepository<BankTransferPayment, Integer> {

    // Find bank transfer details by order ID
    Optional<BankTransferPayment> findFirstByOrderIdOrderByPaymentIdDesc(Integer orderId);
}
