package com.dfine.oms.module4_payment.repository;

import com.dfine.oms.module4_payment.entity.CourierPartner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

// Repository interface for courier partners.
@Repository
public interface CourierRepository extends JpaRepository<CourierPartner, Integer> {

    // Get all currently active courier partners for customer selection
    List<CourierPartner> findByIsActiveTrue();

    // Look up courier by name (e.g., Domex Express, Pronto Logistics)
    Optional<CourierPartner> findByCourierName(String courierName);
}
