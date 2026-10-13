package com.dfine.oms.module4_payment.repository;

import com.dfine.oms.module4_payment.entity.DeliveryShipment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

// Repository interface for delivery shipments and courier tracking.
@Repository
public interface DeliveryRepository extends JpaRepository<DeliveryShipment, Integer> {

    // Look up delivery shipment details for an order
    Optional<DeliveryShipment> findByOrderId(Integer orderId);

    // Look up shipment by tracking number given by courier
    Optional<DeliveryShipment> findByTrackingNumber(String trackingNumber);
}
