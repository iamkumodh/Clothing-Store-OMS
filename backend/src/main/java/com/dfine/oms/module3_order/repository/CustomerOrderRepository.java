package com.dfine.oms.module3_order.repository;

import com.dfine.oms.module3_order.entity.CustomerOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerOrderRepository extends JpaRepository<CustomerOrder, Integer> {

    List<CustomerOrder> findByCustomerIdOrderByOrderDateDesc(Integer customerId);

    Optional<CustomerOrder> findByOrderNumber(String orderNumber);
}
