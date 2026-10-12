package com.dfine.oms.module2_product.repository;

import com.dfine.oms.module2_product.entity.RestockLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

// Repository interface for accessing restock transaction history
@Repository
public interface RestockLogRepository extends JpaRepository<RestockLog, Integer> {

    // Retrieve restock logs for a specific variant ordered by most recent first
    List<RestockLog> findByVariant_VariantIdOrderByRestockedAtDesc(Integer variantId);

    // Retrieve all restock audit logs across the whole store ordered by most recent first
    List<RestockLog> findAllByOrderByRestockedAtDesc();
}
